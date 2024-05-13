import React, { useRef, useEffect, useState } from 'react';

const YouTubePlayer = ({ videoUrl }) => {
  const playerRef = useRef(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    const videoId = extractVideoId(videoUrl);
    if (videoId && apiLoaded) {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId,
      });
    }
  }, [videoUrl, apiLoaded]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onload = () => setApiLoaded(true); // Set apiLoaded to true when the script is loaded
    document.body.appendChild(script);

    // Cleanup: Remove the script element when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array to ensure the effect runs only once

  const extractVideoId = url => {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1];
  };

  return (
    <div id="youtube-player">
      {/* This div will be replaced by the YouTube player */}
    </div>
  );
};

export default YouTubePlayer;