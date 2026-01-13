#!/bin/bash
# EC2 Deployment Setup Script for /var/www
# Run with sudo: sudo bash ec2-setup.sh

set -e

echo "🚀 Setting up ILEAP on EC2 at /var/www..."

# Update system
echo "📦 Updating system packages..."
dnf update -y
dnf upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js..."
dnf module install -y nodejs:20

# Install Python 3.11+
echo "📦 Installing Python..."
dnf install -y python3.11 python3-pip

# Install Nginx
echo "📦 Installing Nginx..."
dnf install -y nginx

# Install Git
dnf install -y git

# Create directory structure
echo "📁 Creating directory structure at /var/www..."
mkdir -p /var/www/ileap
mkdir -p /var/www/ileap/clients
mkdir -p /var/www/ileap/api
mkdir -p /var/www/ileap/uploads

# Set ownership
chown -R www-data:www-data /var/www/ileap
chmod -R 755 /var/www/ileap

echo "✅ EC2 setup complete!"
echo "📝 Next steps:"
echo "1. Clone repository to /var/www/ileap"
echo "2. Run deployment script: bash deployment/deploy.sh"
