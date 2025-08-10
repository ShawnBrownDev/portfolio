"use client";

import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, className }) => {
  // Extract video ID and platform
  const getVideoInfo = (url: string) => {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    // Vimeo patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    // Loom patterns
    const loomRegex = /(?:loom\.com\/(?:share|embed)\/?)([a-f0-9]{32})/;
    const loomMatch = url.match(loomRegex);
    
    if (youtubeMatch) {
      return { platform: 'youtube', id: youtubeMatch[1] };
    } else if (vimeoMatch) {
      return { platform: 'vimeo', id: vimeoMatch[1] };
    } else if (loomMatch) {
      return { platform: 'loom', id: loomMatch[1] };
    } else {
      return { platform: 'direct', id: url };
    }
  };

  const videoInfo = getVideoInfo(videoUrl);

  const renderVideo = () => {
    switch (videoInfo.platform) {
      case 'youtube':
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoInfo.id}?rel=0&modestbranding=1`}
            title={title || 'YouTube video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        );
      
      case 'vimeo':
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoInfo.id}?title=0&byline=0&portrait=0`}
            title={title || 'Vimeo video'}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        );
      
      case 'loom':
        return (
          <iframe
            src={`https://www.loom.com/embed/${videoInfo.id}`}
            title={title || 'Loom video'}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        );
      
      case 'direct':
        return (
          <video
            controls
            className="w-full h-full rounded-lg"
            preload="metadata"
          >
            <source src={videoInfo.id} type="video/mp4" />
            <source src={videoInfo.id} type="video/webm" />
            <source src={videoInfo.id} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        );
      
      default:
        return (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Unsupported video format</p>
          </div>
        );
    }
  };

  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className || ''}`}>
      {renderVideo()}
    </div>
  );
};

export default VideoPlayer;