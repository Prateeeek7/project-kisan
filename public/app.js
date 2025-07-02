// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "pratik-project-kisan-2025.firebaseapp.com",
    projectId: "pratik-project-kisan-2025",
    storageBucket: "pratik-project-kisan-2025.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Global variables
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let currentLanguage = 'en';

// DOM elements
const voiceButton = document.getElementById('voiceButton');
const voiceButtonText = document.getElementById('voiceButtonText');
const voiceStatus = document.getElementById('voiceStatus');
const voiceOutput = document.getElementById('voiceOutput');
const languageSelect = document.getElementById('languageSelect');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisResult = document.getElementById('analysisResult');
const cropNameInput = document.getElementById('cropName');
const locationInput = document.getElementById('location');
const marketBtn = document.getElementById('marketBtn');
const marketResult = document.getElementById('marketResult');
const schemeQueryInput = document.getElementById('schemeQuery');
const schemeBtn = document.getElementById('schemeBtn');
const schemeResult = document.getElementById('schemeResult');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const audioPlayer = document.getElementById('audioPlayer');
const activityList = document.getElementById('activityList');

// Language translations
const translations = {
    en: {
        voiceTitle: 'Voice Assistant',
        startVoice: 'Start Voice',
        stopVoice: 'Stop Voice',
        voiceStatus: 'Click to start voice interaction',
        recording: 'Recording... Speak now',
        processing: 'Processing your request...',
        uploadImage: 'Click to upload crop image',
        analyzeCrop: 'Analyze Crop',
        getMarketData: 'Get Market Data',
        searchSchemes: 'Search Schemes',
        cropPlaceholder: 'Enter crop name (e.g., Tomato)',
        locationPlaceholder: 'Enter location (e.g., Bangalore)',
        schemePlaceholder: 'Ask about schemes (e.g., drip irrigation subsidy)',
        weatherForecast: 'Weather Forecast',
        pestControl: 'Pest Control',
        fertilizerGuide: 'Fertilizer Guide',
        irrigationTips: 'Irrigation Tips',
        recentActivity: 'Recent Activity',
        loadingText: 'Processing your request...'
    },
    kn: {
        voiceTitle: 'ಧ್ವನಿ ಸಹಾಯಕ',
        startVoice: 'ಧ್ವನಿ ಪ್ರಾರಂಭಿಸಿ',
        stopVoice: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
        voiceStatus: 'ಧ್ವನಿ ಸಂವಾದ ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
        recording: 'ರೆಕಾರ್ಡಿಂಗ್... ಈಗ ಮಾತನಾಡಿ',
        processing: 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...',
        uploadImage: 'ಬೆಳೆ ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
        analyzeCrop: 'ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
        getMarketData: 'ಮಾರುಕಟ್ಟೆ ಡೇಟಾ ಪಡೆಯಿರಿ',
        searchSchemes: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
        cropPlaceholder: 'ಬೆಳೆ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಉದಾ., ಟೊಮೇಟೊ)',
        locationPlaceholder: 'ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ (ಉದಾ., ಬೆಂಗಳೂರು)',
        schemePlaceholder: 'ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ (ಉದಾ., ಡ್ರಿಪ್ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ)',
        weatherForecast: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
        pestControl: 'ಕೀಟ ನಿಯಂತ್ರಣ',
        fertilizerGuide: 'ರಸಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ',
        irrigationTips: 'ನೀರಾವರಿ ಸಲಹೆಗಳು',
        recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
        loadingText: 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...'
    },
    hi: {
        voiceTitle: 'आवाज सहायक',
        startVoice: 'आवाज शुरू करें',
        stopVoice: 'आवाज बंद करें',
        voiceStatus: 'आवाज संवाद शुरू करने के लिए क्लिक करें',
        recording: 'रिकॉर्डिंग... अब बोलें',
        processing: 'आपका अनुरोध संसाधित किया जा रहा है...',
        uploadImage: 'फसल की तस्वीर अपलोड करने के लिए क्लिक करें',
        analyzeCrop: 'फसल का विश्लेषण करें',
        getMarketData: 'बाजार डेटा प्राप्त करें',
        searchSchemes: 'योजनाओं की खोज करें',
        cropPlaceholder: 'फसल का नाम दर्ज करें (जैसे, टमाटर)',
        locationPlaceholder: 'स्थान दर्ज करें (जैसे, बैंगलोर)',
        schemePlaceholder: 'योजनाओं के बारे में पूछें (जैसे, ड्रिप सिंचाई सब्सिडी)',
        weatherForecast: 'मौसम पूर्वानुमान',
        pestControl: 'कीट नियंत्रण',
        fertilizerGuide: 'उर्वरक गाइड',
        irrigationTips: 'सिंचाई सुझाव',
        recentActivity: 'हाल की गतिविधि',
        loadingText: 'आपका अनुरोध संसाधित किया जा रहा है...'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadRecentActivity();
});

function initializeApp() {
    // Set up event listeners
    voiceButton.addEventListener('click', toggleVoiceRecording);
    languageSelect.addEventListener('change', changeLanguage);
    imageInput.addEventListener('change', handleImageUpload);
    analyzeBtn.addEventListener('click', analyzeCrop);
    marketBtn.addEventListener('click', getMarketAnalysis);
    schemeBtn.addEventListener('click', searchGovernmentSchemes);
    
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });
    
    // Update placeholders based on language
    updatePlaceholders();
}

// Language handling
function changeLanguage() {
    currentLanguage = languageSelect.value;
    updateUI();
    updatePlaceholders();
}

function updateUI() {
    const t = translations[currentLanguage];
    
    document.getElementById('voiceTitle').textContent = t.voiceTitle;
    voiceButtonText.textContent = isRecording ? t.stopVoice : t.startVoice;
    voiceStatus.textContent = isRecording ? t.recording : t.voiceStatus;
    document.querySelector('.upload-content span').textContent = t.uploadImage;
    analyzeBtn.textContent = t.analyzeCrop;
    marketBtn.textContent = t.getMarketData;
    schemeBtn.textContent = t.searchSchemes;
    document.querySelector('.recent-activity h3').textContent = t.recentActivity;
    loadingText.textContent = t.loadingText;
}

function updatePlaceholders() {
    const t = translations[currentLanguage];
    cropNameInput.placeholder = t.cropPlaceholder;
    locationInput.placeholder = t.locationPlaceholder;
    schemeQueryInput.placeholder = t.schemePlaceholder;
}

// Voice recording functionality
async function toggleVoiceRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
        });
        
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await processVoiceInput(audioBlob);
        };
        
        mediaRecorder.start();
        isRecording = true;
        updateVoiceUI();
        
    } catch (error) {
        console.error('Error starting recording:', error);
        showNotification('Error accessing microphone. Please check permissions.', 'error');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;
        updateVoiceUI();
    }
}

function updateVoiceUI() {
    const t = translations[currentLanguage];
    
    if (isRecording) {
        voiceButton.classList.add('recording');
        voiceButtonText.textContent = t.stopVoice;
        voiceStatus.textContent = t.recording;
    } else {
        voiceButton.classList.remove('recording');
        voiceButtonText.textContent = t.startVoice;
        voiceStatus.textContent = t.voiceStatus;
    }
}

async function processVoiceInput(audioBlob) {
    showLoading('Processing your voice input...');
    
    try {
        // Convert audio to base64
        const base64Audio = await blobToBase64(audioBlob);
        
        // Send to Firebase Function for processing
        const response = await fetch('/api/voice-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                audioBase64: base64Audio.split(',')[1], // Remove data URL prefix
                userId: 'demo-user', // In real app, get from auth
                language: currentLanguage === 'en' ? 'en-IN' : 
                         currentLanguage === 'kn' ? 'kn-IN' : 'hi-IN'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Display the response
            voiceOutput.innerHTML = `
                <div class="voice-query">
                    <strong>You said:</strong> ${result.query}
                </div>
                <div class="voice-response">
                    <strong>Kisan Assistant:</strong> ${result.response}
                </div>
            `;
            
            // Play audio response
            if (result.audioBase64) {
                playAudioResponse(result.audioBase64);
            }
            
            // Add to recent activity
            addToRecentActivity('Voice Query', result.query);
            
        } else {
            throw new Error(result.error || 'Failed to process voice input');
        }
        
    } catch (error) {
        console.error('Error processing voice input:', error);
        showNotification('Error processing voice input. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Image upload and crop analysis
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

async function analyzeCrop() {
    const file = imageInput.files[0];
    if (!file) {
        showNotification('Please select an image first.', 'error');
        return;
    }
    
    showLoading('Analyzing crop disease...');
    
    try {
        const base64Image = await blobToBase64(file);
        
        const response = await fetch('/api/diagnose-crop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageBase64: base64Image.split(',')[1],
                userId: 'demo-user',
                cropType: 'Unknown',
                language: currentLanguage
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            analysisResult.textContent = result.diagnosis;
            addToRecentActivity('Crop Analysis', 'Analyzed crop for diseases');
        } else {
            throw new Error(result.error || 'Failed to analyze crop');
        }
        
    } catch (error) {
        console.error('Error analyzing crop:', error);
        showNotification('Error analyzing crop. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Market analysis
async function getMarketAnalysis() {
    const cropName = cropNameInput.value.trim();
    const location = locationInput.value.trim();
    
    if (!cropName || !location) {
        showNotification('Please enter both crop name and location.', 'error');
        return;
    }
    
    showLoading('Fetching market data...');
    
    try {
        const response = await fetch('/api/market-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cropName,
                location,
                language: currentLanguage
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            marketResult.textContent = result.analysis;
            addToRecentActivity('Market Analysis', `Analyzed ${cropName} prices in ${location}`);
        } else {
            throw new Error(result.error || 'Failed to get market data');
        }
        
    } catch (error) {
        console.error('Error getting market data:', error);
        showNotification('Error fetching market data. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Government schemes search
async function searchGovernmentSchemes() {
    const query = schemeQueryInput.value.trim();
    
    if (!query) {
        showNotification('Please enter a query about government schemes.', 'error');
        return;
    }
    
    showLoading('Searching government schemes...');
    
    try {
        const response = await fetch('/api/government-schemes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                language: currentLanguage
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            schemeResult.textContent = result.schemes;
            addToRecentActivity('Government Schemes', `Searched for: ${query}`);
        } else {
            throw new Error(result.error || 'Failed to search schemes');
        }
        
    } catch (error) {
        console.error('Error searching schemes:', error);
        showNotification('Error searching government schemes. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Quick actions
function handleQuickAction(event) {
    const action = event.currentTarget.dataset.action;
    const t = translations[currentLanguage];
    
    let query = '';
    switch (action) {
        case 'weather':
            query = 'weather forecast for my area';
            break;
        case 'pest':
            query = 'pest control methods for crops';
            break;
        case 'fertilizer':
            query = 'fertilizer guide for different crops';
            break;
        case 'irrigation':
            query = 'irrigation tips and best practices';
            break;
    }
    
    if (query) {
        schemeQueryInput.value = query;
        searchGovernmentSchemes();
    }
}

// Utility functions
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function playAudioResponse(audioBase64) {
    const audioBlob = base64ToBlob(audioBase64, 'audio/mp3');
    const audioUrl = URL.createObjectURL(audioBlob);
    
    audioPlayer.src = audioUrl;
    audioPlayer.play().catch(error => {
        console.error('Error playing audio:', error);
    });
}

function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

function showLoading(message) {
    loadingText.textContent = message;
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Recent activity management
function addToRecentActivity(title, description) {
    const activity = {
        title,
        description,
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for demo (in real app, use Firestore)
    let activities = JSON.parse(localStorage.getItem('kisanActivities') || '[]');
    activities.unshift(activity);
    activities = activities.slice(0, 10); // Keep only last 10
    localStorage.setItem('kisanActivities', JSON.stringify(activities));
    
    loadRecentActivity();
}

function loadRecentActivity() {
    const activities = JSON.parse(localStorage.getItem('kisanActivities') || '[]');
    
    activityList.innerHTML = activities.length === 0 ? 
        '<p style="text-align: center; color: #666;">No recent activity</p>' : 
        activities.map(activity => `
            <div class="activity-item">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
        `).join('');
}

// Initialize the app
updateUI();
