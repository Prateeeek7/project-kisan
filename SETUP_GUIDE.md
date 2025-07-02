# 🔧 Project Kisan Setup Guide

Follow these steps to set up and deploy Project Kisan successfully.

## Step 1: Create Firebase Project

### Via Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: "Project Kisan AI"
4. Enter project ID: `your-name-project-kisan-2024` (must be unique globally)
5. Disable Google Analytics (optional)
6. Click "Create project"

### Get Your Firebase Config
1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register app with name "Project Kisan Web"
6. Copy the firebaseConfig object

## Step 2: Update Configuration Files

### Update .firebaserc
Replace `pratik-project-kisan-2025` with your actual project ID:
```json
{
  "projects": {
    "default": "your-name-project-kisan-2024"
  }
}
```

### Update public/app.js
Replace the firebaseConfig with your actual values:
```javascript
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_0q_zgSB_qDWcC3-nMxlMuY6vicodGCE",
  authDomain: "pratik-project-kisan-2025.firebaseapp.com",
  projectId: "pratik-project-kisan-2025",
  storageBucket: "pratik-project-kisan-2025.firebasestorage.app",
  messagingSenderId: "401100872754",
  appId: "1:401100872754:web:b3e9fc3e96a7dfd353702b",
  measurementId: "G-XPZ6QNHLQB"
};
```

## Step 3: Enable Firebase Services

In Firebase Console, enable these services:

### 1. Authentication
- Go to "Authentication" → "Get started"
- Enable "Anonymous" authentication
- Click "Save"

### 2. Firestore Database
- Go to "Firestore Database" → "Create database"
- Start in test mode
- Choose location (us-central1 recommended)

### 3. Storage
- Go to "Storage" → "Get started"
- Start in test mode
- Choose location (us-central1 recommended)

### 4. Functions
- Go to "Functions" → "Get started"
- Enable billing (required for external APIs)

## Step 4: Set Up Google AI and Cloud Services

### Get Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (you'll need this for Gemini models)

### Install Google Cloud CLI
```bash
# macOS
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### Authenticate and Enable APIs
```bash
# Login to Google Cloud
gcloud auth login
gcloud auth application-default login

# Set your project
gcloud config set project your-name-project-kisan-2024

# Enable required APIs
gcloud services enable speech.googleapis.com
gcloud services enable texttospeech.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
```

## Step 5: Set Up Environment Variables

### Create .env file
```bash
cd functions
cp env.example .env
```

### Update .env file
Edit the `.env` file and add your actual values:
```env
# Google AI API Key (Get from https://makersuite.google.com/app/apikey)
GOOGLE_AI_API_KEY=your-actual-api-key-here

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-name-project-kisan-2024
VERTEX_AI_LOCATION=us-central1

# Firebase Configuration
FIREBASE_PROJECT_ID=your-name-project-kisan-2024

# API Configuration
NODE_ENV=production
```

## Step 6: Install Dependencies

```bash
# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

## Step 7: Deploy to Firebase

```bash
# Deploy everything
firebase deploy

# Or deploy step by step
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## Step 8: Test Your Application

After deployment, your app will be available at:
`https://your-name-project-kisan-2024.web.app`

### Test Features:
1. **Voice Assistant**: Click microphone button and speak
2. **Crop Analysis**: Upload a plant photo
3. **Market Data**: Enter crop name and location
4. **Government Schemes**: Search for agricultural schemes

## Troubleshooting

### Common Issues:

**"Permission denied" error:**
- Make sure you're logged into Firebase: `firebase login`
- Check project permissions in Firebase Console

**"API not enabled" error:**
- Enable all required Google Cloud APIs
- Wait a few minutes for changes to propagate

**"Billing not enabled" error:**
- Enable billing in Google Cloud Console
- Required for external API calls

**"Functions deployment failed":**
- Check Node.js version (18+ required)
- Ensure all dependencies are installed
- Check function logs in Firebase Console

### Get Help:
- 📖 Read the full [README.md](README.md)
- 🔧 Check [Firebase Console](https://console.firebase.google.com)
- 🤖 Check [Google Cloud Console](https://console.cloud.google.com)
- 📧 Contact support if needed

## Success! 🎉

Once deployed, your AI-powered farmer assistant will be live with:
- ✅ Voice interaction in multiple languages
- ✅ AI-powered crop disease diagnosis
- ✅ Real-time market analysis
- ✅ Government scheme navigation
- ✅ Beautiful, responsive interface

---

**Project Kisan** - Empowering farmers with AI! 🌾🤖 