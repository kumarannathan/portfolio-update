import React, { useEffect, useState } from 'react';
import { getCurrentlyPlaying, getRecentlyPlayed, getAccessToken } from '../services/spotifyService';

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

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

const SpotifyNowPlaying: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentTrack, setRecentTrack] = useState<RecentlyPlayedItem | null>(null);
  const [spotifyError, setSpotifyError] = useState(false);

  const getTimeAgo = (timestamp: string): string => {
    const now = new Date().getTime();
    const playedAt = new Date(timestamp).getTime();
    const diffInMinutes = Math.floor((now - playedAt) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const token = await getAccessToken();
        
        if (!token) {
          setSpotifyError(true);
          setCurrentTrack(null);
          setIsPlaying(false);
          return;
        }

        setSpotifyError(false);
        const data = await getCurrentlyPlaying(token);
        
        if (data && data.item && data.is_playing) {
          setCurrentTrack(data.item);
          setIsPlaying(true);
        } else {
          setCurrentTrack(null);
          setIsPlaying(false);
          
          const recentData = await getRecentlyPlayed(token);
          if (recentData) {
            setRecentTrack(recentData);
          }
        }
      } catch (error) {
        setSpotifyError(true);
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    };

    fetchCurrentlyPlaying();
    const interval = setInterval(fetchCurrentlyPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="spotify-sidebar">
      <h4 className="spotify-sidebar-title">
        {isPlaying ? 'Now Playing' : 'Recently Played'}
      </h4>
      
      {currentTrack && isPlaying ? (
        <div className="spotify-sidebar-content">
          {currentTrack.album.images[0] && (
            <img 
              src={currentTrack.album.images[0].url} 
              alt={currentTrack.album.name}
              className="spotify-sidebar-art"
            />
          )}
          <div className="spotify-sidebar-info">
            <div className="audio-wave">
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
            <a 
              href={currentTrack.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-sidebar-track"
            >
              {currentTrack.name}
            </a>
            <p className="spotify-sidebar-artist">
              {currentTrack.artists.map(artist => artist.name).join(', ')}
            </p>
          </div>
        </div>
      ) : recentTrack ? (
        <div className="spotify-sidebar-content">
          {recentTrack.track.album.images[0] && (
            <img 
              src={recentTrack.track.album.images[0].url} 
              alt={recentTrack.track.album.name}
              className="spotify-sidebar-art"
            />
          )}
          <div className="spotify-sidebar-info">
            <a 
              href={recentTrack.track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-sidebar-track"
            >
              {recentTrack.track.name}
            </a>
            <p className="spotify-sidebar-artist">
              {recentTrack.track.artists.map(artist => artist.name).join(', ')}
            </p>
            <p className="spotify-sidebar-time">
              {getTimeAgo(recentTrack.played_at)}
            </p>
          </div>
        </div>
      ) : spotifyError ? (
        <p className="spotify-sidebar-offline">Offline</p>
      ) : (
        <p className="spotify-sidebar-offline">Nothing playing</p>
      )}
    </div>
  );
};

export default SpotifyNowPlaying;

