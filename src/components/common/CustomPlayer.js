import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";

import Player from "@vimeo/player";

export default function CustomPlayer({ video, className, videoClass }) {
  const iframeRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);
  const [showCenterButton, setShowCenterButton] = useState(false);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const toggleMute = () => {
    if (!player) return;
    player.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);
    if (player) {
      player.setVolume(value / 100);
      setIsMuted(value === 0);
    }
  };

  useEffect(() => {
    if (sliderValue === 0) setIsMuted(true);
    if (iframeRef.current) {
      const vimeoPlayer = new Player(iframeRef.current);
      setPlayer(vimeoPlayer);

      vimeoPlayer.on("play", () => {
        setIsPlaying(true);
      });
      vimeoPlayer.on("pause", () => {
        setIsPlaying(false);
      });
      vimeoPlayer.on("volumechange", (data) => {
        setIsMuted(data.muted);
        if (data.volume === 0) setIsMuted(true);
        if (data.muted) {
          setSliderValue(0);
        } else {
          setSliderValue(data.volume * 100);
        }
      });
    }
  }, [sliderValue, isMuted]);

  useEffect(() => {
    setShowCenterButton(true);

    const timer = setTimeout(() => {
      setShowCenterButton(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying]);

  return (
    <div className={`h-full w-[90%] relative aspect-video group ${className}`}>
      <iframe
        src={video}
        width="100%"
        height="100%"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Truth in Every Headline_ Transparency You Can Trust"
        ref={iframeRef}
        allow="autoplay; fullscreen; picture-in-picture"
        className={videoClass}
      />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-black/50 rounded-full cursor-pointer transition-opacity duration-300 select-none ${
          showCenterButton ? "opacity-100" : "opacity-0"
        }`}
        onClick={togglePlay}
      >
        <Icon
          icon={isPlaying ? "solar:play-bold" : "basil:pause-solid"}
          width={40}
          height={40}
          className="text-white cursor-pointer"
        />
      </div>

      <div
        className={`absolute bottom-0 left-0 p-3 py-2 flex items-center gap-4 mt-4 select-none text-white w-full bg-[#101828]/30 opacity-0 rounded-3xl transition-opacity duration-300 group-hover:opacity-100`}
      >
        <Icon
          icon={isPlaying ? "basil:pause-solid" : "solar:play-bold"}
          onClick={togglePlay}
          width={24}
          height={24}
        />
        <Icon
          icon={
            isMuted
              ? "garden:volume-muted-fill-12"
              : "garden:volume-unmuted-fill-12"
          }
          onClick={toggleMute}
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleVolumeChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
