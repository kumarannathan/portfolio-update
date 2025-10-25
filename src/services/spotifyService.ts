interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
  progress_ms: number;
}

// Backend URL for token management
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://backend-port-production.up.railway.app';

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;
let backendErrorLogged = false;

/**
 * Get a valid Spotify access token from our backend
 * The backend handles all the refresh logic securely
 */
export const getAccessToken = async (): Promise<string | null> => {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/spotify/token`);
    
    if (!response.ok) {
      if (!backendErrorLogged) {
        console.error(`❌ Backend error (${response.status}): Check Railway logs at ${BACKEND_URL}`);
        backendErrorLogged = true;
      }
      return null;
    }

    const data = await response.json();
    
    if (data.access_token) {
      cachedToken = data.access_token;
      // Tokens last 1 hour, cache expiry
      tokenExpiry = Date.now() + 3600000;
      backendErrorLogged = false; // Reset error flag on success
      console.log('✓ Got fresh Spotify token from backend');
      return data.access_token;
    }
    
    return null;
  } catch (error) {
    if (!backendErrorLogged) {
      console.error('❌ Cannot reach backend:', BACKEND_URL);
      backendErrorLogged = true;
    }
    return null;
  }
};

export const getCurrentlyPlaying = async (accessToken: string): Promise<SpotifyCurrentlyPlaying | null> => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 204) {
      // No content - nothing is playing
      return null;
    }

    if (!response.ok) {
      console.error('Spotify API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return null;
  }
};

// OAuth flow helpers
export const getAuthUrl = (clientId: string, redirectUri: string): string => {
  const scopes = ['user-read-currently-playing', 'user-read-playback-state'];
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'token');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('show_dialog', 'false');
  
  return authUrl.toString();
};

// Get the appropriate redirect URI based on environment
export const getRedirectUri = (): string => {
  const hostname = window.location.hostname;
  
  // Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  
  // Production
  return 'https://kmrnn.dev';
};

export const getTokenFromUrl = (): string | null => {
  const hash = window.location.hash;
  if (!hash) return null;
  
  const params = new URLSearchParams(hash.substring(1));
  const token = params.get('access_token');
  
  if (token) {
    // Clear the hash from URL
    window.history.replaceState(null, '', window.location.pathname);
  }
  
  return token;
};

// Get recently played tracks
export const getRecentlyPlayed = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 204 || !response.ok) {
      return null;
    }

    const data = await response.json();
    return data.items && data.items.length > 0 ? data.items[0] : null;
  } catch (error) {
    console.error('Error fetching recently played:', error);
    return null;
  }
};

