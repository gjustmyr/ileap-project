#!/usr/bin/env python3
"""
Quick Start Script - Train Your Custom Job Matching Model

This script runs all the steps needed to train your model from scratch.

Usage:
    python ml_models/quick_start.py
"""

import os
import sys
import subprocess

def run_command(command, description):
    """Run a command and print status"""
    print("\n" + "="*60)
    print(description)
    print("="*60)
    print(f"Running: {command}\n")
    
    result = subprocess.run(command, shell=True)
    
    if result.returncode != 0:
        print(f"\n❌ Error: {description} failed!")
        sys.exit(1)
    
    print(f"\n✅ {description} completed successfully!")
    return True


def main():
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║   CUSTOM JOB MATCHING MODEL - QUICK START                 ║
    ║                                                            ║
    ║   Train your own matching model from scratch!             ║
    ║   No external AI APIs required.                           ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    # Check if we're in the right directory
    if not os.path.exists("ml_models"):
        print("❌ Error: ml_models directory not found!")
        print("Please run this script from the server-fastapi directory:")
        print("  cd server-fastapi")
        print("  python ml_models/quick_start.py")
        sys.exit(1)
    
    # Create ml_models directory if it doesn't exist
    os.makedirs("ml_models", exist_ok=True)
    
    print("\nThis script will:")
    print("  1. Collect training data from your database")
    print("  2. Extract features and train multiple models")
    print("  3. Select the best model and save it")
    print("  4. Test the model")
    print("\nEstimated time: 1-3 minutes\n")
    
    input("Press ENTER to continue...")
    
    # Step 1: Collect training data
    run_command(
        "python ml_models/collect_training_data.py",
        "STEP 1: Collecting training data"
    )
    
    # Check if training data was created
    if not os.path.exists("ml_models/training_data.csv"):
        print("\n❌ Error: Training data not created!")
        print("Make sure you have application data in your database.")
        sys.exit(1)
    
    # Step 2: Train the model
    run_command(
        "python ml_models/train_model.py",
        "STEP 2: Training machine learning models"
    )
    
    # Check if model was created
    if not os.path.exists("ml_models/best_model_latest.pkl"):
        print("\n❌ Error: Model not created!")
        sys.exit(1)
    
    # Step 3: Test predictor
    run_command(
        "python ml_models/predictor.py",
        "STEP 3: Testing model predictor"
    )
    
    print("\n" + "="*60)
    print("🎉 SUCCESS! Your custom matching model is ready!")
    print("="*60)
    print("\nModel saved to: ml_models/best_model_latest.pkl")
    print("\nNext steps:")
    print("  1. Start your FastAPI server: python main.py")
    print("  2. Test the API: http://localhost:3000/api/match/health")
    print("  3. Get predictions: POST /api/match/predict")
    print("\nSee ml_models/README.md for full documentation.")
    print("\n✨ Your model will improve as you collect more application data!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Training interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
