#!/bin/bash

# Project Kisan Deployment Script
# This script automates the deployment process for the AI-powered farmer assistant

set -e  # Exit on any error

echo "🌾 Project Kisan - AI Farmer Assistant Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check if Firebase CLI is installed
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI is not installed. Installing now..."
        npm install -g firebase-tools
    fi
    
    # Check if gcloud CLI is installed
    if ! command -v gcloud &> /dev/null; then
        print_warning "Google Cloud CLI is not installed. Please install it from: https://cloud.google.com/sdk/docs/install"
        print_status "You can continue with Firebase deployment, but Google Cloud features will not work."
    fi
    
    print_success "Prerequisites check completed"
}

# Setup Firebase project
setup_firebase() {
    print_status "Setting up Firebase project..."
    
    # Check if user is logged in to Firebase
    if ! firebase projects:list &> /dev/null; then
        print_status "Please log in to Firebase..."
        firebase login
    fi
    
    # Initialize Firebase project if not already done
    if [ ! -f ".firebaserc" ]; then
        print_status "Initializing Firebase project..."
        firebase init hosting,functions,firestore,storage --project=project-kisan
    fi
    
    print_success "Firebase setup completed"
}

# Setup Google Cloud services
setup_google_cloud() {
    if ! command -v gcloud &> /dev/null; then
        print_warning "Skipping Google Cloud setup - gcloud CLI not found"
        return
    fi
    
    print_status "Setting up Google Cloud services..."
    
    # Check if user is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_status "Please authenticate with Google Cloud..."
        gcloud auth login
        gcloud auth application-default login
    fi
    
    # Set project
    gcloud config set project project-kisan
    
    # Enable required APIs
    print_status "Enabling required Google Cloud APIs..."
    gcloud services enable vertexai.googleapis.com
    gcloud services enable speech.googleapis.com
    gcloud services enable texttospeech.googleapis.com
    gcloud services enable cloudfunctions.googleapis.com
    gcloud services enable firestore.googleapis.com
    gcloud services enable storage.googleapis.com
    
    print_success "Google Cloud services setup completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -d "functions" ]; then
        cd functions
        npm install
        cd ..
    else
        print_error "Functions directory not found"
        exit 1
    fi
    
    print_success "Dependencies installed"
}

# Configure environment
configure_environment() {
    print_status "Configuring environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f "functions/.env" ]; then
        cat > functions/.env << EOF
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=project-kisan
VERTEX_AI_LOCATION=us-central1

# Firebase Configuration
FIREBASE_PROJECT_ID=project-kisan

# API Configuration
NODE_ENV=production
EOF
        print_success "Created .env file"
    else
        print_status ".env file already exists"
    fi
    
    # Update Firebase config in app.js if needed
    if grep -q "your-api-key" public/app.js; then
        print_warning "Please update Firebase configuration in public/app.js with your project details"
        print_status "You can find your Firebase config in the Firebase Console under Project Settings"
    fi
}

# Deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."
    
    # Deploy functions first
    print_status "Deploying Firebase Functions..."
    firebase deploy --only functions
    
    # Deploy hosting
    print_status "Deploying Firebase Hosting..."
    firebase deploy --only hosting
    
    # Deploy Firestore rules
    print_status "Deploying Firestore rules..."
    firebase deploy --only firestore:rules
    
    # Deploy Storage rules
    print_status "Deploying Storage rules..."
    firebase deploy --only storage
    
    print_success "Firebase deployment completed"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get the hosting URL
    HOSTING_URL=$(firebase hosting:channel:list --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$HOSTING_URL" ]; then
        HOSTING_URL="https://project-kisan.web.app"
    fi
    
    print_success "Application deployed successfully!"
    echo ""
    echo "🌐 Your application is available at:"
    echo "   $HOSTING_URL"
    echo ""
    echo "📱 Features available:"
    echo "   ✅ Voice Assistant (Speech-to-Text & Text-to-Speech)"
    echo "   ✅ Crop Disease Diagnosis (AI-powered image analysis)"
    echo "   ✅ Market Analysis (Real-time price data)"
    echo "   ✅ Government Schemes (AI-powered search)"
    echo "   ✅ Multi-language Support (English, Kannada, Hindi)"
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Update Firebase configuration in public/app.js"
    echo "   2. Test all features in your browser"
    echo "   3. Configure custom domain if needed"
    echo "   4. Set up monitoring and analytics"
}

# Main deployment process
main() {
    echo ""
    print_status "Starting Project Kisan deployment..."
    echo ""
    
    check_prerequisites
    setup_firebase
    setup_google_cloud
    install_dependencies
    configure_environment
    deploy_firebase
    test_deployment
    
    echo ""
    print_success "🎉 Project Kisan deployment completed successfully!"
    echo ""
    echo "For support and documentation, visit:"
    echo "📖 README.md - Complete setup and usage guide"
    echo "🌐 Firebase Console - Monitor your application"
    echo "🤖 Google Cloud Console - Manage AI services"
    echo ""
}

# Run main function
main "$@" 