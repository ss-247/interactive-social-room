# 🌐 Interactive Social Room

A real-time collaborative web application where users can share short messages with each other instantly. Perfect for learning about real-time database integration, static site deployment, and vanilla JavaScript.

## Features

✨ **Real-time User Count** - See how many people are in the room  
💬 **3 Message Boxes** - Each user can send 3 messages (20 chars max)  
🔄 **Live Synchronization** - Messages update across all browsers instantly  
📝 **Optional Markdown** - Toggle Markdown rendering for rich formatting  
🚀 **GitHub Pages Deployment** - Deploy as a static site for free  
🔥 **Firebase Backend** - Serverless real-time database  

## Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Firebase Realtime Database** - Real-time synchronization
- **marked.js** - Lightweight Markdown rendering
- **GitHub Pages** - Free static hosting

## Setup Instructions

### 1. Firebase Configuration

#### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create Project"**
3. Name it `interactive-social-room`
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"** and wait for setup

#### Step 2: Create a Web App

1. In your Firebase project, click the **Web icon** (</>) to add a web app
2. Name it `interactive-social-room-web`
3. Check "Also set up Firebase Hosting for this app" (optional - you can deploy to GitHub Pages instead)
4. Click **"Register app"**
5. Copy the Firebase config object that appears
6. You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "ABC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

#### Step 3: Set Up Realtime Database

1. In Firebase Console, go to **"Realtime Database"** (left sidebar under Build)
2. Click **"Create Database"**
3. Choose your location (e.g., United States)
4. Start in **"Test Mode"** (allows read/write without authentication)
5. Click **"Enable"**
6. Copy your database URL (it looks like `https://your-project.firebaseio.com`)

#### Step 4: Update `app.js` with Your Config

Open `app.js` and replace the `firebaseConfig` object at the top with your credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};
```

**⚠️ Security Note:** These keys are meant to be public (they're in client-side JavaScript). For production, configure Firebase Security Rules in your Realtime Database to restrict access.

---

### 2. Local Development Setup

#### Prerequisites

- Python 3.6+
- Git

#### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/interactive-social-room.git
   cd interactive-social-room
   ```

2. **Activate the virtual environment:**

   **On Windows:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

   **On macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

3. **Start a local web server:**

   **Using Python (recommended):**
   ```bash
   python -m http.server 8000
   ```

   Or for Python 2:
   ```bash
   python -m SimpleHTTPServer 8000
   ```

4. **Open in browser:**
   ```
   http://localhost:8000
   ```

5. **Test real-time sync:**
   - Open the URL in multiple browser tabs
   - Type in the message boxes
   - Watch messages sync in real-time! 🎉

#### Using the Development Script (Optional)

A simple Python development server script is available:

```bash
python dev_server.py
```

This starts a server on `http://localhost:8000` with auto-reload capabilities.

---

### 3. GitHub Pages Deployment

#### Prerequisites

- GitHub account
- Git installed and configured
- This repository cloned and configured with Firebase

#### Deployment Steps

1. **Enable GitHub Pages in repository settings:**
   - Go to your repository on GitHub
   - Click **"Settings"** (top right)
   - Scroll to **"Pages"** (left sidebar)
   - Under "Build and deployment":
     - Set **Source** to `Deploy from a branch`
     - Set **Branch** to `main` (or your default branch)
     - Click **"Save"**

2. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Deploy interactive social room"
   git push origin main
   ```

3. **GitHub Pages will automatically deploy:**
   - Wait ~1 minute for GitHub to build and publish
   - Visit `https://YOUR_USERNAME.github.io/interactive-social-room`
   - Your site is now live! 🚀

4. **Share the link:**
   - Open the site in multiple browser windows/tabs
   - Share the link with friends
   - Everyone can chat in real-time!

#### Important Notes

- **Firebase must be configured** - Without valid Firebase credentials, the app won't sync
- **Test Mode permissions** - Make sure your Firebase Realtime Database is in Test Mode or has appropriate security rules
- **HTTPS by default** - GitHub Pages uses HTTPS, which is compatible with Firebase

---

## How to Use

1. **Join the room:** Just open the website in your browser
2. **See who's online:** Check the "Active Users" counter at the top
3. **Send messages:** Type in any of the 3 message boxes (max 20 characters each)
4. **Use Markdown (optional):** Check the "Render Markdown in messages" box to format text:
   - `**bold**` → **bold**
   - `*italic*` → *italic*
   - `` `code` `` → `code`
   - `[link](url)` → [link](url)
5. **Real-time sync:** All changes appear instantly for other users
6. **Leave room:** Just close the browser tab (you'll be removed after 5 minutes of inactivity)

---

## File Structure

```
interactive-social-room/
├── index.html          # Main HTML structure
├── style.css           # Modern styling with animations
├── app.js              # Firebase integration and app logic
├── README.md           # This file
├── venv/               # Python virtual environment
└── .git/               # Git repository
```

---

## Architecture

### Data Structure (Firebase Realtime Database)

```
{
  "users": {
    "user_1234567890_1234": {
      "messages": ["Hello", "World", "!"],
      "markdown": false,
      "timestamp": 1234567890000
    },
    "user_9876543210_5678": {
      "messages": ["Hi", "there", ""],
      "markdown": true,
      "timestamp": 1234567895000
    }
  }
}
```

### Real-time Sync Flow

1. User types in input box
2. JavaScript captures input and throttles updates (300ms)
3. Message data sent to Firebase Realtime Database
4. All other clients receive update instantly via Firebase listeners
5. UI updates to show new messages from all users

### User Management

- Users are auto-generated unique IDs on page load
- Heartbeat sent every 10 seconds to keep user active
- Users removed after 5 minutes of inactivity
- User count updates in real-time as users join/leave

---

## Customization Ideas

### Easy Enhancements

- **Add user nicknames:** Let users set a display name (store in Firebase)
- **More message boxes:** Increase `MESSAGE_COUNT` in `app.js`
- **Longer messages:** Increase `MESSAGE_LIMIT` to allow more characters
- **Color themes:** Add theme selector to toggle CSS variables
- **Message history:** Store messages in separate database collection

### Advanced Features

- **User authentication:** Add Firebase Authentication for named users
- **Private messages:** Implement direct messaging between users
- **Rooms:** Support multiple chat rooms with different topics
- **Message reactions:** Add emoji reactions to messages
- **Typing indicators:** Show when other users are typing

---

## Security & Privacy Notes

### Current Setup

- **Firebase Test Mode** - Allows anyone with the config to read/write
- **Public data** - All messages visible to all users
- **No authentication** - Users are anonymous

### For Production

Enable security rules in Firebase:

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": "!root.child('users').child(auth.uid).exists() || auth.uid != null"
    }
  }
}
```

This allows users to write their own data but prevents overwriting others' data.

---

## Troubleshooting

### "Firebase is not defined"

- Verify Firebase SDK is loaded in `index.html`
- Check browser console for CDN errors
- Ensure internet connection for CDN resources

### Messages not syncing

- Check Firebase config in `app.js` is correct
- Verify Firebase Realtime Database is created and in Test Mode
- Open browser DevTools → Console to see error messages
- Check Firebase Console for database permissions

### No users appearing

- Refresh the page
- Check that you're in Test Mode in Firebase
- Verify the database URL is correct
- Look for CORS errors in the browser console

### GitHub Pages shows 404

- Verify repository is public (or you're logged in)
- Go to Settings → Pages and ensure it's enabled
- Check that your branch is `main` (or your default branch)
- Wait a few minutes for GitHub Pages to deploy

---

## Contributing

This is a learning project. Feel free to:

- Fork the repository
- Add features or improvements
- Submit pull requests
- Open issues for bugs

## License

MIT License - Feel free to use this project for learning or as a starting point for your own projects.

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [marked.js Documentation](https://marked.js.org/)
- [GitHub Pages Guide](https://pages.github.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Happy coding! 🎉**

Questions or issues? Check the troubleshooting section or open an issue on GitHub.
