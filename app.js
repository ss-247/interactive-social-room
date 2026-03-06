/*
 * Interactive Social Room - Firebase Real-time Sync
 * 
 * FIREBASE SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Click "Create Project" and name it "interactive-social-room"
 * 3. In the project settings, create a Web App
 * 4. Copy your Firebase config object and paste it in the firebaseConfig below
 * 5. Go to Database > Create Database > Start in Test Mode
 * 6. Refresh this page and it should connect!
 */

// ============================================================================
// FIREBASE CONFIGURATION - REPLACE WITH YOUR OWN
// ============================================================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};

// ============================================================================
// APP STATE & CONFIG
// ============================================================================

const APP_CONFIG = {
    MESSAGE_LIMIT: 20,
    MESSAGE_COUNT: 3,
    UPDATE_THROTTLE: 300,
    SESSION_TIMEOUT: 5 * 60 * 1000 // 5 minutes
};

let app, database, currentUserId, db;
let lastUpdateTime = 0;
let messageInput = ['', '', ''];
let markdownEnabled = false;

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initializeApp() {
    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        
        // Generate unique user ID
        currentUserId = generateUserId();
        
        // Get DOM elements
        const messageInputs = document.querySelectorAll('.message-input');
        const markdownToggle = document.getElementById('markdownToggle');
        
        // Set up event listeners
        messageInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => handleMessageInput(e, index));
        });
        
        markdownToggle.addEventListener('change', (e) => {
            markdownEnabled = e.target.checked;
            updateAllUserMessages();
        });
        
        // Add user to database with heartbeat
        addUserToRoom();
        setInterval(updateUserHeartbeat, 10000);
        
        // Listen for user count and messages
        listenToUsers();
        
        // Clean up on page unload
        window.addEventListener('beforeunload', removeUserFromRoom);
        
        console.log('✅ App initialized with User ID:', currentUserId);
        
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        showError('Failed to connect to Firebase. Check your configuration.');
    }
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

function generateUserId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `user_${timestamp}_${random}`.substring(0, 20);
}

function addUserToRoom() {
    const userData = {
        messages: ['', '', ''],
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        markdown: false
    };
    
    database.ref('users/' + currentUserId).set(userData);
}

function updateUserHeartbeat() {
    database.ref('users/' + currentUserId + '/timestamp').set(
        firebase.database.ServerValue.TIMESTAMP
    );
}

function removeUserFromRoom() {
    database.ref('users/' + currentUserId).remove();
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

function handleMessageInput(event, index) {
    const value = event.target.value.substring(0, APP_CONFIG.MESSAGE_LIMIT);
    event.target.value = value;
    messageInput[index] = value;
    
    // Update character count
    const charCount = event.target.nextElementSibling;
    if (charCount) {
        charCount.textContent = `${value.length}/${APP_CONFIG.MESSAGE_LIMIT}`;
    }
    
    // Throttle updates to Firebase
    const now = Date.now();
    if (now - lastUpdateTime > APP_CONFIG.UPDATE_THROTTLE) {
        updateUserMessages();
        lastUpdateTime = now;
    }
}

function updateUserMessages() {
    database.ref('users/' + currentUserId + '/messages').set(messageInput);
    database.ref('users/' + currentUserId + '/markdown').set(markdownEnabled);
}

// ============================================================================
// LISTENING TO USERS
// ============================================================================

function listenToUsers() {
    database.ref('users').on('value', (snapshot) => {
        const users = snapshot.val() || {};
        const activeUsers = cleanupInactiveUsers(users);
        
        updateUserCount(Object.keys(activeUsers).length);
        updateUsersList(activeUsers);
    }, (error) => {
        console.error('Error listening to users:', error);
    });
}

function cleanupInactiveUsers(users) {
    const now = Date.now();
    const activeUsers = {};
    
    Object.entries(users).forEach(([userId, userData]) => {
        const lastSeen = userData.timestamp || 0;
        
        // Keep users active for 5 minutes
        if (now - lastSeen < APP_CONFIG.SESSION_TIMEOUT) {
            activeUsers[userId] = userData;
        } else {
            // Optionally remove inactive users from database
            database.ref('users/' + userId).remove();
        }
    });
    
    return activeUsers;
}

function updateUserCount(count) {
    document.getElementById('userCount').textContent = count;
}

function updateUsersList(users) {
    const usersList = document.getElementById('usersList');
    
    if (Object.keys(users).length === 0) {
        usersList.innerHTML = '<div class="empty-state">No users in the room yet. Be the first!</div>';
        return;
    }
    
    usersList.innerHTML = '';
    
    Object.entries(users).forEach(([userId, userData]) => {
        const card = createUserCard(userId, userData);
        usersList.appendChild(card);
    });
}

function createUserCard(userId, userData) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const messages = userData.messages || ['', '', ''];
    const useMarkdown = userData.markdown || false;
    
    let messagesHTML = messages.map(msg => {
        if (!msg) return '<div class="message-item"></div>';
        
        const escapedMsg = escapeHtml(msg);
        let content = escapedMsg;
        
        if (useMarkdown) {
            try {
                // marked is imported as ES module, use synchronous rendering
                content = marked.parseInline(escapedMsg);
            } catch (e) {
                console.warn('Markdown parse error:', e);
                content = escapedMsg;
            }
        }
        
        return `<div class="message-item">${content}</div>`;
    }).join('');
    
    const timestamp = formatTime(userData.timestamp);
    const shortId = userId.substring(0, 12) + '...';
    
    card.innerHTML = `
        <div class="user-header">
            <span class="user-id">ID: ${shortId}</span>
            <span class="user-timestamp">${timestamp}</span>
        </div>
        <div class="user-messages">
            ${messagesHTML}
        </div>
    `;
    
    return card;
}

function updateAllUserMessages() {
    // Refresh all user cards to apply/remove markdown rendering
    const usersList = document.getElementById('usersList');
    const cards = usersList.querySelectorAll('.user-card');
    // Simple approach: re-trigger the value event to refresh
    database.ref('users').once('value', (snapshot) => {
        const users = snapshot.val() || {};
        updateUsersList(users);
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatTime(timestamp) {
    if (!timestamp) return 'just now';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f87171;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => alert.remove(), 5000);
}

// ============================================================================
// INITIALIZATION HOOK
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
