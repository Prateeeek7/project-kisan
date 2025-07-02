const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const axios = require('axios');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'your-api-key');

// Initialize Speech and Text-to-Speech clients
const speechClient = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();

// Express app for handling HTTP requests
const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware
app.use(cors);

// 1. Crop Disease Diagnosis with Gemini Vision
app.post('/diagnose-crop', async (req, res) => {
  try {
    const { imageBase64, userId, cropType, language = 'en' } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Initialize Gemini Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Create prompt for crop disease diagnosis
    const prompt = `
    You are an expert agricultural scientist. Analyze this crop image and provide:
    1. Disease/pest identification (if any)
    2. Severity level (Low/Medium/High)
    3. Recommended treatment using locally available, affordable remedies
    4. Prevention tips
    5. Expected recovery time
    
    Please respond in ${language === 'kn' ? 'Kannada' : 'English'} with simple, actionable advice.
    Focus on organic and cost-effective solutions that a small-scale farmer can implement.
    `;

    // Convert base64 to Uint8Array for image
    const imageBytes = Buffer.from(imageBase64, 'base64');

    // Generate content with image
    const result = await model.generateContent([prompt, imageBytes]);
    const response = await result.response;
    const diagnosis = response.text();

    // Store diagnosis in Firestore
    const diagnosisRef = await admin.firestore().collection('crop_analysis').add({
      userId,
      cropType,
      diagnosis,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      imageUrl: `crop_images/${userId}/${Date.now()}.jpg`
    });

    res.json({
      success: true,
      diagnosis,
      analysisId: diagnosisRef.id
    });

  } catch (error) {
    console.error('Crop diagnosis error:', error);
    res.status(500).json({ error: 'Failed to diagnose crop disease' });
  }
});

// 2. Real-Time Market Analysis
app.post('/market-analysis', async (req, res) => {
  try {
    const { cropName, location, language = 'en' } = req.body;

    // Initialize Gemini model for market analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Fetch market data from public APIs (simulated for demo)
    const marketData = await fetchMarketData(cropName, location);

    const prompt = `
    Analyze this market data for ${cropName} in ${location}:
    ${JSON.stringify(marketData, null, 2)}
    
    Provide a simple analysis in ${language === 'kn' ? 'Kannada' : 'English'} including:
    1. Current price trend
    2. Best time to sell
    3. Price prediction for next week
    4. Market recommendations
    
    Keep it simple and actionable for a farmer.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    // Store market analysis
    await admin.firestore().collection('market_data').add({
      cropName,
      location,
      analysis,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      data: marketData
    });

    res.json({
      success: true,
      analysis,
      marketData
    });

  } catch (error) {
    console.error('Market analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze market data' });
  }
});

// 3. Government Scheme Navigation
app.post('/government-schemes', async (req, res) => {
  try {
    const { query, language = 'en' } = req.body;

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an expert on Indian government agricultural schemes. 
    Query: "${query}"
    
    Provide information in ${language === 'kn' ? 'Kannada' : 'English'} about:
    1. Relevant government schemes
    2. Eligibility criteria
    3. Application process
    4. Required documents
    5. Contact information
    6. Application deadlines
    
    Focus on schemes available for small-scale farmers in Karnataka.
    Include specific subsidy amounts and benefits.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const schemeInfo = response.text();

    // Store scheme query
    await admin.firestore().collection('government_schemes').add({
      query,
      response: schemeInfo,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      schemes: schemeInfo
    });

  } catch (error) {
    console.error('Government schemes error:', error);
    res.status(500).json({ error: 'Failed to fetch government schemes' });
  }
});

// 4. Speech-to-Text Processing
app.post('/speech-to-text', async (req, res) => {
  try {
    const { audioBase64, language = 'en-IN' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const audio = {
      content: audioBase64
    };

    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: language,
      alternativeLanguageCodes: ['kn-IN', 'hi-IN', 'en-IN'],
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    res.json({
      success: true,
      transcription
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

// 5. Text-to-Speech Processing
app.post('/text-to-speech', async (req, res) => {
  try {
    const { text, language = 'en-IN' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const request = {
      input: { text: text },
      voice: {
        languageCode: language,
        name: language === 'kn-IN' ? 'kn-IN-Standard-A' : 'en-IN-Standard-A',
        ssmlGender: 'FEMALE'
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent.toString('base64');

    res.json({
      success: true,
      audioBase64: audioContent
    });

  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// 6. Voice Assistant - Combined functionality
app.post('/voice-assistant', async (req, res) => {
  try {
    const { audioBase64, userId, language = 'en-IN' } = req.body;

    // Step 1: Convert speech to text
    const audio = { content: audioBase64 };
    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: language,
      alternativeLanguageCodes: ['kn-IN', 'hi-IN', 'en-IN'],
    };

    const [speechResponse] = await speechClient.recognize({ audio, config });
    const query = speechResponse.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');

    // Step 2: Process the query with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are Kisan Assistant, an AI expert helping Indian farmers.
    Farmer's query: "${query}"
    
    Determine the type of assistance needed:
    1. Crop disease diagnosis - if they mention plant problems, diseases, pests
    2. Market analysis - if they ask about prices, selling, market trends
    3. Government schemes - if they ask about subsidies, schemes, financial help
    4. General farming advice - for other agricultural queries
    
    Provide a helpful response in ${language === 'kn-IN' ? 'Kannada' : 'English'}.
    Keep it simple, actionable, and farmer-friendly.
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const response = aiResponse.text();

    // Step 3: Convert response to speech
    const ttsRequest = {
      input: { text: response },
      voice: {
        languageCode: language,
        name: language === 'kn-IN' ? 'kn-IN-Standard-A' : 'en-IN-Standard-A',
        ssmlGender: 'FEMALE'
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);
    const audioContent = ttsResponse.audioContent.toString('base64');

    // Store interaction
    await admin.firestore().collection('voice_interactions').add({
      userId,
      query,
      response,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      query,
      response,
      audioBase64: audioContent
    });

  } catch (error) {
    console.error('Voice assistant error:', error);
    res.status(500).json({ error: 'Failed to process voice request' });
  }
});

// Helper function to fetch market data (simulated)
async function fetchMarketData(cropName, location) {
  // In a real implementation, this would fetch from actual market APIs
  // For demo purposes, returning simulated data
  const basePrice = Math.random() * 50 + 20; // Random price between 20-70
  const trend = Math.random() > 0.5 ? 'increasing' : 'decreasing';
  
  return {
    crop: cropName,
    location: location,
    currentPrice: basePrice.toFixed(2),
    unit: 'per kg',
    trend: trend,
    lastUpdated: new Date().toISOString(),
    weeklyAverage: (basePrice * 0.9).toFixed(2),
    marketDemand: Math.random() > 0.5 ? 'High' : 'Medium',
    bestSellingTime: trend === 'increasing' ? 'Next 2-3 days' : 'Wait for price recovery'
  };
}

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);

// Additional HTTP functions for specific endpoints
exports.diagnoseCrop = functions.https.onCall(async (data, context) => {
  // Callable function for crop diagnosis
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Implementation similar to the HTTP endpoint
  // This provides better security for authenticated users
});

exports.getMarketData = functions.https.onCall(async (data, context) => {
  // Callable function for market data
  // Implementation for authenticated market data access
});
