# 🎵 Spotify Integration

This portfolio uses a secure backend to handle Spotify authentication.

## How It Works

1. **Frontend** calls your backend API to get access tokens
2. **Backend** (Railway) manages refresh tokens and returns fresh access tokens
3. **Frontend** uses the token to fetch currently playing music

## Architecture

```
Portfolio (Frontend)
    ↓
    Calls: https://backend-port-production.up.railway.app/api/spotify/token
    ↓
Backend (Railway)
    ↓
    Returns: { access_token: "..." }
    ↓
Portfolio uses token for Spotify API calls
```

## Benefits

✅ **Secure** - No secrets exposed in frontend  
✅ **Auto-refresh** - Backend handles token expiration  
✅ **Fast** - Tokens are cached client-side  
✅ **No CORS** - Backend handles all Spotify API calls

## Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The backend URL is already configured:
```
REACT_APP_BACKEND_URL=https://backend-port-production.up.railway.app
```

## Features

- Displays currently playing track with album art
- Shows recently played music when nothing is playing
- Auto-updates every 10 seconds
- Animated audio waveform when music is playing

## Backend Repository

Your backend is hosted on Railway and handles all Spotify authentication securely.

No setup needed - it just works! 🎉

