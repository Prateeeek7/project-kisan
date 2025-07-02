# Project Kisan - AI-Powered Farmer Assistant 🌾

Project Kisan is an innovative AI-powered personal assistant designed specifically for small-scale farmers in India. It acts as a personal agronomist, market analyst, and government scheme navigator, providing actionable intelligence to help farmers protect their crops, maximize their income, and navigate complex agricultural systems.

## 🎯 Problem Statement

Rohan, a young farmer in rural Karnataka, faces several challenges:
- **Crop Disease Diagnosis**: Strange yellow spots on tomato leaves - is it fungus, pest, or fertilizer issue?
- **Market Timing**: When to sell produce for maximum profit? Prices vary wildly day by day.
- **Information Access**: Local agricultural office is miles away, information scattered and not in native language.
- **Literacy Barriers**: Complex agricultural information not accessible through voice.

## 🚀 Solution Features

### 1. **Instant Crop Disease Diagnosis** 🔍
- **Multimodal AI Analysis**: Uses Gemini Vision model to analyze crop photos
- **Instant Diagnosis**: Identifies pests, diseases, and provides severity assessment
- **Local Remedies**: Suggests affordable, locally available treatments
- **Prevention Tips**: Offers preventive measures and recovery timelines

### 2. **Real-Time Market Analysis** 📊
- **Live Price Data**: Fetches real-time market prices from public APIs
- **Trend Analysis**: Uses Gemini AI to analyze price trends and patterns
- **Selling Recommendations**: Provides optimal selling time suggestions
- **Market Intelligence**: Offers demand analysis and price predictions

### 3. **Government Scheme Navigation** 🏛️
- **Scheme Discovery**: AI-powered search through government agricultural schemes
- **Eligibility Check**: Clear explanation of eligibility criteria
- **Application Guidance**: Step-by-step application process
- **Document Requirements**: Lists required documents and deadlines

### 4. **Voice-First Interaction** 🎤
- **Speech-to-Text**: Converts voice queries in local dialects (Kannada, Hindi, English)
- **Text-to-Speech**: Responds with clear, easy-to-understand voice notes
- **Literacy Barrier Solution**: Overcomes reading/writing challenges
- **Natural Language Processing**: Understands farmer-specific terminology

## 🛠️ Technology Stack

### **Google AI Technologies (Mandatory)**
- **Vertex AI**: Core AI platform for Gemini models
- **Gemini Pro Vision**: Multimodal analysis for crop disease diagnosis
- **Gemini Pro**: Text analysis for market data and government schemes
- **Speech-to-Text API**: Voice input processing
- **Text-to-Speech API**: Voice response generation

### **Firebase Platform**
- **Firebase Hosting**: Web application hosting
- **Firebase Functions**: Serverless backend with AI integration
- **Firestore**: Database for user data and analysis history
- **Firebase Storage**: Image storage for crop photos
- **Firebase Authentication**: User management

### **Frontend Technologies**
- **HTML5/CSS3**: Modern, responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **Web APIs**: MediaRecorder for voice capture
- **Progressive Web App**: Offline capabilities

## 📱 User Interface Features

### **Voice-First Design**
- Large, accessible voice button
- Visual feedback during recording
- Multi-language support (English, Kannada, Hindi)
- Audio playback of responses

### **Image Upload Interface**
- Drag-and-drop crop photo upload
- Camera integration for direct capture
- Image preview before analysis
- Progress indicators during processing

### **Market Analysis Dashboard**
- Simple form inputs for crop and location
- Real-time price display
- Trend visualization
- Actionable recommendations

### **Government Schemes Portal**
- Natural language query interface
- Categorized scheme information
- Direct application links
- Eligibility checker

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Google Cloud Project with Vertex AI enabled
- Firebase project created

### 1. **Clone and Setup**
```bash
git clone <repository-url>
cd project-kisan
```

### 2. **Install Dependencies**
```bash
cd functions
npm install
```

### 3. **Configure Firebase**
```bash
firebase login
firebase use --add
# Select your Firebase project
```

### 4. **Set Up Google Cloud Services**
```bash
# Enable required APIs
gcloud services enable vertexai.googleapis.com
gcloud services enable speech.googleapis.com
gcloud services enable texttospeech.googleapis.com

# Set up authentication
gcloud auth application-default login
```

### 5. **Configure Environment Variables**
Create a `.env` file in the `functions` directory:
```env
GOOGLE_CLOUD_PROJECT=your-project-id
VERTEX_AI_LOCATION=us-central1
```

### 6. **Update Firebase Configuration**
Edit `public/app.js` and replace the Firebase config with your project details:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 7. **Deploy to Firebase**
```bash
# Deploy functions
firebase deploy --only functions

# Deploy hosting
firebase deploy --only hosting

# Deploy everything
firebase deploy
```

## 🎯 Usage Examples

### **Crop Disease Diagnosis**
1. Click "Upload Image" in the Crop Disease Diagnosis section
2. Take a photo of the affected plant or upload from gallery
3. Click "Analyze Crop"
4. Receive instant diagnosis with treatment recommendations

### **Market Analysis**
1. Enter crop name (e.g., "Tomato")
2. Enter location (e.g., "Bangalore")
3. Click "Get Market Data"
4. View current prices, trends, and selling recommendations

### **Government Schemes**
1. Type your query (e.g., "drip irrigation subsidy")
2. Click "Search Schemes"
3. Get detailed information about relevant schemes
4. Follow application links and requirements

### **Voice Assistant**
1. Click the large microphone button
2. Speak your query in your preferred language
3. Wait for AI processing
4. Listen to the voice response

## 🔧 API Endpoints

### **Crop Disease Diagnosis**
```
POST /api/diagnose-crop
{
  "imageBase64": "base64_encoded_image",
  "userId": "user_id",
  "cropType": "crop_name",
  "language": "en|kn|hi"
}
```

### **Market Analysis**
```
POST /api/market-analysis
{
  "cropName": "crop_name",
  "location": "location",
  "language": "en|kn|hi"
}
```

### **Government Schemes**
```
POST /api/government-schemes
{
  "query": "scheme_query",
  "language": "en|kn|hi"
}
```

### **Voice Assistant**
```
POST /api/voice-assistant
{
  "audioBase64": "base64_encoded_audio",
  "userId": "user_id",
  "language": "en-IN|kn-IN|hi-IN"
}
```

## 🌟 Special Features

### **Multi-Language Support**
- **English**: Primary interface language
- **Kannada (ಕನ್ನಡ)**: Native language for Karnataka farmers
- **Hindi (हिंदी)**: Widely understood across India

### **Accessibility Features**
- High contrast mode support
- Reduced motion preferences
- Screen reader compatibility
- Large touch targets for mobile use

### **Offline Capabilities**
- Progressive Web App features
- Cached responses for common queries
- Offline image analysis (when possible)

## 📊 Performance Optimizations

- **Image Compression**: Automatic image optimization before AI analysis
- **Caching**: Intelligent caching of market data and scheme information
- **Lazy Loading**: Progressive loading of features
- **CDN**: Global content delivery for fast access

## 🔒 Security Features

- **Input Validation**: All user inputs validated and sanitized
- **Rate Limiting**: API rate limiting to prevent abuse
- **Authentication**: Firebase Auth integration for user management
- **Data Privacy**: Secure handling of user data and images

## 🚀 Deployment Options

### **Firebase Hosting (Recommended)**
- Automatic SSL certificates
- Global CDN
- Easy deployment with `firebase deploy`

### **Google Cloud Run**
- Containerized deployment
- Auto-scaling capabilities
- Custom domain support

### **Local Development**
```bash
firebase emulators:start
```

## 📈 Future Enhancements

### **Planned Features**
- **Weather Integration**: Real-time weather data and forecasts
- **Soil Analysis**: AI-powered soil health assessment
- **Crop Planning**: Seasonal crop recommendations
- **Financial Planning**: Budget and loan assistance
- **Community Features**: Farmer-to-farmer knowledge sharing

### **AI Model Improvements**
- **Custom Training**: Domain-specific model fine-tuning
- **Local Language Models**: Better support for regional dialects
- **Predictive Analytics**: Advanced crop yield predictions

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and standards
- Testing requirements
- Documentation updates
- Feature proposals

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google AI**: For providing cutting-edge AI technologies
- **Firebase**: For the robust backend infrastructure
- **Indian Farmers**: For inspiring this solution
- **Agricultural Experts**: For domain knowledge and validation

## 📞 Support

For support and questions:
- **Email**: support@projectkisan.com
- **Documentation**: [docs.projectkisan.com](https://docs.projectkisan.com)
- **Community**: [community.projectkisan.com](https://community.projectkisan.com)

---

**Project Kisan** - Empowering farmers with AI-driven intelligence for a sustainable agricultural future. 🌱🤖
