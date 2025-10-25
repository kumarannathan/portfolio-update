# 🚨 Backend Error - How to Fix

Your Railway backend is returning a **500 Internal Server Error** when trying to get Spotify tokens.

## What's Wrong?

The backend at `https://backend-port-production.up.railway.app/api/spotify/token` is crashing or misconfigured.

## How to Fix:

### 1. Check Railway Logs
```
1. Go to railway.app
2. Open your backend project
3. Click on "Deployments"
4. Check the latest logs for errors
```

### 2. Common Issues:

**Missing Environment Variables:**
- Make sure these are set in Railway:
  ```
  SPOTIFY_CLIENT_ID=99e521c45a3e4cbfbdf1d8432b78507a
  SPOTIFY_CLIENT_SECRET=c1a7dde267574a65a37d132114bda402
  SPOTIFY_REFRESH_TOKEN=<your-refresh-token>
  ```

**Invalid Refresh Token:**
- The refresh token might have expired
- Generate a new one from Spotify Developer Dashboard

**Backend Code Error:**
- Check if the `/api/spotify/token` endpoint exists
- Verify the refresh token logic is working

### 3. Quick Test:

Test your backend directly in browser:
```
https://backend-port-production.up.railway.app/api/spotify/token
```

Should return:
```json
{
  "access_token": "BQD9ZetIv6tFFUHz...",
  "expires_in": 3600
}
```

If you see an error, that's what needs fixing!

## Temporary Workaround:

The portfolio will now show "Spotify offline" instead of crashing. 
It checks for updates every 30 seconds instead of every 10 seconds.

Once you fix the backend, Spotify will automatically start working again! ✅

