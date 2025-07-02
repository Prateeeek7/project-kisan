# 🚀 Quick Start Guide - Project Kisan

Get Project Kisan up and running in 5 minutes!

## ⚡ Quick Deployment

### Option 1: Automated Deployment (Recommended)
```bash
# Make the script executable and run it
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment
```bash
# 1. Install dependencies
cd functions
npm install
cd ..

# 2. Deploy to Firebase
firebase deploy
```

## 🔧 Essential Configuration

### 1. Update Firebase Configuration
Edit `public/app.js` and replace the Firebase config:
```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 2. Enable Google Cloud APIs
```bash
# Enable required APIs
gcloud services enable vertexai.googleapis.com
gcloud services enable speech.googleapis.com
gcloud services enable texttospeech.googleapis.com
```

## 🎯 Test the Features

### Voice Assistant
1. Click the large microphone button
2. Speak: "What is the price of tomatoes today?"
3. Listen to the AI response

### Crop Disease Diagnosis
1. Upload a photo of a plant
2. Click "Analyze Crop"
3. Get instant diagnosis and treatment advice

### Market Analysis
1. Enter: Crop = "Tomato", Location = "Bangalore"
2. Click "Get Market Data"
3. View price trends and recommendations

### Government Schemes
1. Type: "drip irrigation subsidy"
2. Click "Search Schemes"
3. Get detailed scheme information

## 🌐 Access Your App

After deployment, your app will be available at:
- **Production**: `https://your-project-id.web.app`
- **Development**: `http://localhost:5000` (with `firebase serve`)

## 🆘 Troubleshooting

### Common Issues

**"Firebase CLI not found"**
```bash
npm install -g firebase-tools
```

**"Google Cloud APIs not enabled"**
```bash
gcloud auth login
gcloud services enable vertexai.googleapis.com
```

**"Functions deployment failed"**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Get Help
- 📖 Read the full [README.md](README.md)
- 🔧 Check [Firebase Console](https://console.firebase.google.com)
- 🤖 Check [Google Cloud Console](https://console.cloud.google.com)

## 🎉 Success!

Your AI-powered farmer assistant is now live! Farmers can:
- ✅ Diagnose crop diseases instantly
- ✅ Get real-time market analysis
- ✅ Find government schemes easily
- ✅ Use voice interaction in their language

---

**Project Kisan** - Empowering farmers with AI! 🌾🤖 