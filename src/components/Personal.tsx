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

interface PersonalProps {
  onSlideToCreative?: () => void;
}

const Personal: React.FC<PersonalProps> = ({ onSlideToCreative }) => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentTrack, setRecentTrack] = useState<RecentlyPlayedItem | null>(null);
  const [isPhotographyExpanded, setIsPhotographyExpanded] = useState(false);
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

  // Fetch currently playing track automatically
  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        // Get token from backend (secure, auto-refreshing)
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
          // Not currently playing, fetch recently played
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

    // Fetch immediately
    fetchCurrentlyPlaying();

    // Poll every 30 seconds (reduced from 10s to avoid spam when backend is down)
    const interval = setInterval(fetchCurrentlyPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="personal-panel">
      {onSlideToCreative && (
        <button 
          className="slide-tab slide-tab-right" 
          onClick={onSlideToCreative}
        >
          <span>‹</span>
        </button>
      )}
      <div className="personal-content">
        <h2 className="personal-title">who i am offline</h2>
        
        <div className="personal-section">
          <div className="section-header-with-animation">
            <h3 className="personal-section-title">currently listening</h3>
            {currentTrack && isPlaying && (
              <div className="audio-wave">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
            )}
          </div>
          
          {currentTrack && isPlaying ? (
            <div className="now-playing">
              {currentTrack.album.images[0] && (
                <img 
                  src={currentTrack.album.images[0].url} 
                  alt={currentTrack.album.name}
                  className="album-art"
                />
              )}
              <div className="track-info">
                <a 
                  href={currentTrack.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-name"
                >
                  {currentTrack.name}
                </a>
                <p className="artist-name">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
                <p className="album-name">
                  {currentTrack.album.name}
                </p>
              </div>
            </div>
          ) : recentTrack ? (
            <div className="now-playing recently-played">
              {recentTrack.track.album.images[0] && (
                <img 
                  src={recentTrack.track.album.images[0].url} 
                  alt={recentTrack.track.album.name}
                  className="album-art"
                />
              )}
              <div className="track-info">
                <a 
                  href={recentTrack.track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="track-name"
                >
                  {recentTrack.track.name}
                </a>
                <p className="artist-name">
                  {recentTrack.track.artists.map(artist => artist.name).join(', ')}
                </p>
                <p className="time-ago">
                  {getTimeAgo(recentTrack.played_at)}
                </p>
              </div>
            </div>
          ) : spotifyError ? (
            <div className="not-playing">
              <p style={{ fontSize: '12px', opacity: 0.5 }}>Spotify offline</p>
            </div>
          ) : (
            <div className="not-playing">
              <p>Nothing playing right now</p>
            </div>
          )}
        </div>

        <div className="personal-section">
          <div 
            className="expandable-header"
            onClick={() => setIsPhotographyExpanded(!isPhotographyExpanded)}
          >
            <span className={`expand-arrow ${isPhotographyExpanded ? 'expanded' : ''}`}>›</span>
            <h3 className="personal-section-title">photography</h3>
          </div>
          {isPhotographyExpanded && (
            <div className="photo-carousel">
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage15.jpeg)'}}></div>
                <img src="/photos/gridimage15.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage16.jpeg)'}}></div>
                <img src="/photos/gridimage16.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage17.jpeg)'}}></div>
                <img src="/photos/gridimage17.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage43.jpeg)'}}></div>
                <img src="/photos/gridimage43.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage51.jpeg)'}}></div>
                <img src="/photos/gridimage51.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage66.jpeg)'}}></div>
                <img src="/photos/gridimage66.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage67.jpeg)'}}></div>
                <img src="/photos/gridimage67.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage68.jpeg)'}}></div>
                <img src="/photos/gridimage68.jpeg" alt="Photography" className="carousel-photo" />
              </div>
              <div className="photo-wrapper">
                <div className="photo-bg" style={{backgroundImage: 'url(/photos/gridimage76.jpeg)'}}></div>
                <img src="/photos/gridimage76.jpeg" alt="Photography" className="carousel-photo" />
              </div>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
};

export default Personal;

