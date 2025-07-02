# ✅ Project Kisan Deployment Checklist

Use this checklist to ensure everything is properly configured before deployment.

## 🔧 Pre-Deployment Checklist

### 1. Firebase Project Setup
- [ ] Created Firebase project via [Firebase Console](https://console.firebase.google.com)
- [ ] Project ID is unique and all lowercase
- [ ] Updated `.firebaserc` with your project ID
- [ ] Updated `public/app.js` with your Firebase config

### 2. Firebase Services Enabled
- [ ] Authentication enabled (Anonymous auth)
- [ ] Firestore Database created
- [ ] Storage enabled
- [ ] Functions enabled (with billing)

### 3. Google AI Setup
- [ ] Got API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Created `functions/.env` file from `env.example`
- [ ] Added Google AI API key to `.env` file

### 4. Google Cloud APIs
- [ ] Speech-to-Text API enabled
- [ ] Text-to-Speech API enabled
- [ ] Cloud Functions API enabled
- [ ] Firestore API enabled
- [ ] Storage API enabled

### 5. Dependencies
- [ ] Ran `npm install` in `functions/` directory
- [ ] All packages installed successfully
- [ ] No critical vulnerabilities (or addressed them)

## 🚀 Deployment Steps

### Step 1: Verify Configuration
```bash
# Check if you're logged into Firebase
firebase projects:list

# Check your current project
firebase use
```

### Step 2: Deploy Functions First
```bash
firebase deploy --only functions
```

### Step 3: Deploy Everything Else
```bash
firebase deploy --only hosting,firestore:rules,storage
```

### Step 4: Test Your Application
- [ ] Visit your app URL: `https://your-project-id.web.app`
- [ ] Test voice assistant
- [ ] Test crop disease diagnosis
- [ ] Test market analysis
- [ ] Test government schemes search

## 🆘 Troubleshooting

### Common Issues:

**"Invalid project id"**
- Make sure project ID is all lowercase
- Check `.firebaserc` file

**"API key not found"**
- Verify Google AI API key in `functions/.env`
- Check API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

**"Functions deployment failed"**
- Check function logs: `firebase functions:log`
- Verify all dependencies installed
- Check environment variables

**"Permission denied"**
- Make sure you're logged in: `firebase login`
- Check project permissions in Firebase Console

## 📞 Get Help

- 📖 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup instructions
- 📖 [README.md](README.md) - Full project documentation
- 🔧 [Firebase Console](https://console.firebase.google.com)
- 🤖 [Google AI Studio](https://makersuite.google.com/app/apikey)

---

**Ready to deploy?** ✅ Check all boxes above, then run `firebase deploy`! 

GOOGLE_AI_API_KEY=your-google-ai-api-key-here

GOOGLE_CLOUD_PROJECT=pratik-project-kisan-2025
VERTEX_AI_LOCATION=us-central1

FIREBASE_PROJECT_ID=pratik-project-kisan-2025

NODE_ENV=production 