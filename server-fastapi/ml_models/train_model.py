"""
STEP 3: Train Machine Learning Models

Train multiple models and select the best one based on performance.

Models to try:
1. Logistic Regression (fast baseline)
2. Random Forest (better with non-linear patterns)
3. XGBoost (best accuracy if data is sufficient)
"""

import pandas as pd
import numpy as np
import joblib
from datetime import datetime
import json

# Scikit-learn imports
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
import matplotlib.pyplot as plt

# Try importing XGBoost (optional)
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
    print("✓ XGBoost available")
except ImportError:
    XGBOOST_AVAILABLE = False
    print("⚠ XGBoost not available (install with: pip install xgboost)")

# Import feature engineering
from feature_engineering import build_feature_matrix


def train_logistic_regression(X_train, y_train):
    """Train Logistic Regression model"""
    print("\n" + "="*60)
    print("Training Logistic Regression")
    print("="*60)
    
    model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight='balanced'  # Handle class imbalance
    )
    
    model.fit(X_train, y_train)
    
    print("✓ Training complete")
    return model


def train_random_forest(X_train, y_train):
    """Train Random Forest model"""
    print("\n" + "="*60)
    print("Training Random Forest")
    print("="*60)
    
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=4,
        random_state=42,
        class_weight='balanced',
        n_jobs=-1  # Use all CPU cores
    )
    
    model.fit(X_train, y_train)
    
    print("✓ Training complete")
    return model


def train_xgboost(X_train, y_train):
    """Train XGBoost model"""
    if not XGBOOST_AVAILABLE:
        print("⚠ XGBoost not available, skipping...")
        return None
    
    print("\n" + "="*60)
    print("Training XGBoost")
    print("="*60)
    
    # Calculate scale_pos_weight for class imbalance
    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
    
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    print("✓ Training complete")
    return model


def evaluate_model(model, X_test, y_test, model_name="Model"):
    """Evaluate model performance"""
    print(f"\n{'='*60}")
    print(f"Evaluating {model_name}")
    print("="*60)
    
    # Predictions
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['No Match', 'Match']))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(cm)
    print(f"True Negatives: {cm[0][0]}, False Positives: {cm[0][1]}")
    print(f"False Negatives: {cm[1][0]}, True Positives: {cm[1][1]}")
    
    # ROC AUC score
    try:
        auc = roc_auc_score(y_test, y_proba)
        print(f"\nROC AUC Score: {auc:.4f}")
    except:
        auc = 0.0
        print("\nCould not calculate ROC AUC")
    
    # Calculate accuracy
    accuracy = (y_pred == y_test).mean()
    
    # Calculate precision and recall manually
    tp = cm[1][1]
    fp = cm[0][1]
    fn = cm[1][0]
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    metrics = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'auc': auc
    }
    
    return metrics, y_pred, y_proba


def plot_feature_importance(model, feature_names, model_name="Model", top_n=10):
    """Plot feature importance for tree-based models"""
    if not hasattr(model, 'feature_importances_'):
        print(f"⚠ {model_name} does not have feature importances")
        return
    
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1][:top_n]
    
    print(f"\nTop {top_n} Feature Importances for {model_name}:")
    for i, idx in enumerate(indices):
        print(f"{i+1}. {feature_names[idx]}: {importances[idx]:.4f}")


def save_model(model, feature_names, metrics, model_name="model"):
    """Save trained model and metadata"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_filename = f"ml_models/{model_name}_{timestamp}.pkl"
    metadata_filename = f"ml_models/{model_name}_{timestamp}_metadata.json"
    
    # Save model
    joblib.dump(model, model_filename)
    print(f"\n✓ Model saved to: {model_filename}")
    
    # Save metadata
    metadata = {
        "model_name": model_name,
        "timestamp": timestamp,
        "feature_names": feature_names,
        "metrics": metrics,
        "sklearn_version": __import__('sklearn').__version__
    }
    
    with open(metadata_filename, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"✓ Metadata saved to: {metadata_filename}")
    
    # Also save as "latest" for easy loading
    latest_model = f"ml_models/{model_name}_latest.pkl"
    latest_metadata = f"ml_models/{model_name}_latest_metadata.json"
    
    joblib.dump(model, latest_model)
    with open(latest_metadata, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"✓ Latest model saved to: {latest_model}")


def train_all_models():
    """Main function to train and compare all models"""
    print("="*60)
    print("JOB MATCHING MODEL TRAINING PIPELINE")
    print("="*60)
    
    # Load training data
    print("\nLoading training data...")
    try:
        df = pd.read_csv("ml_models/training_data.csv")
        print(f"✓ Loaded {len(df)} training examples")
    except FileNotFoundError:
        print("❌ Error: training_data.csv not found")
        print("Run collect_training_data.py first!")
        return
    
    # Build feature matrix
    X, y, feature_names = build_feature_matrix(df)
    
    # Split data
    print("\nSplitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"✓ Training set: {len(X_train)} examples")
    print(f"✓ Test set: {len(X_test)} examples")
    
    # Dictionary to store results
    results = {}
    
    # Train Logistic Regression
    lr_model = train_logistic_regression(X_train, y_train)
    lr_metrics, _, _ = evaluate_model(lr_model, X_test, y_test, "Logistic Regression")
    results['logistic_regression'] = {
        'model': lr_model,
        'metrics': lr_metrics
    }
    
    # Train Random Forest
    rf_model = train_random_forest(X_train, y_train)
    rf_metrics, _, _ = evaluate_model(rf_model, X_test, y_test, "Random Forest")
    plot_feature_importance(rf_model, feature_names, "Random Forest")
    results['random_forest'] = {
        'model': rf_model,
        'metrics': rf_metrics
    }
    
    # Train XGBoost (if available)
    if XGBOOST_AVAILABLE:
        xgb_model = train_xgboost(X_train, y_train)
        if xgb_model:
            xgb_metrics, _, _ = evaluate_model(xgb_model, X_test, y_test, "XGBoost")
            plot_feature_importance(xgb_model, feature_names, "XGBoost")
            results['xgboost'] = {
                'model': xgb_model,
                'metrics': xgb_metrics
            }
    
    # Compare results
    print("\n" + "="*60)
    print("MODEL COMPARISON")
    print("="*60)
    
    comparison_df = pd.DataFrame({
        name: info['metrics'] 
        for name, info in results.items()
    }).T
    
    print(comparison_df.to_string())
    
    # Select best model based on F1 score
    best_model_name = comparison_df['f1'].idxmax()
    best_model = results[best_model_name]['model']
    best_metrics = results[best_model_name]['metrics']
    
    print(f"\n🏆 Best Model: {best_model_name.replace('_', ' ').title()}")
    print(f"   F1 Score: {best_metrics['f1']:.4f}")
    print(f"   Accuracy: {best_metrics['accuracy']:.4f}")
    print(f"   AUC: {best_metrics['auc']:.4f}")
    
    # Save all models
    print("\n" + "="*60)
    print("SAVING MODELS")
    print("="*60)
    
    for name, info in results.items():
        save_model(info['model'], feature_names, info['metrics'], name)
    
    # Save best model as "best_model"
    save_model(best_model, feature_names, best_metrics, "best_model")
    
    print("\n" + "="*60)
    print("✓ TRAINING COMPLETE!")
    print("="*60)
    print(f"\nYou can now use the trained model in your FastAPI application.")
    print(f"Best model saved as: ml_models/best_model_latest.pkl")


if __name__ == "__main__":
    train_all_models()
