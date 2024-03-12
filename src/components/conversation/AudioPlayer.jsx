import { base64ToBlobUrl } from "@/lib/base64ToBlobUrl.js";
import { formatTime } from "@/lib/formatTime.js";
import getBlobDuration from "get-blob-duration";
import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";

export default function AudioPlayer({ media }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [playedDuration, setPlayedDuration] = useState(0);
  const [isPlayed, setIsPlayed] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    const blobUrl = base64ToBlobUrl(media, "audio/webm");
    setBlobUrl(blobUrl);
    getBlobDuration(blobUrl).then((seconds) => setDuration(seconds));
    const handlePauseVideo = () => {
      setIsPlayed(false);
      getBlobDuration(blobUrl).then((seconds) => setDuration(seconds));
    };
    const handleEndVideo = () => {
      setIsPlayed(false);
      setPlayedDuration(0);
      getBlobDuration(blobUrl).then((seconds) => setDuration(seconds));
    };
    if (!audioRef.current) return;
    audioRef.current.addEventListener("pause", handlePauseVideo);
    audioRef.current.addEventListener("ended", handleEndVideo);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("pause", handlePauseVideo);
        audioRef.current.removeEventListener("ended", handleEndVideo);
      }
    };
  }, [media, audioRef.current]);
  useEffect(() => {
    let interval;
    const handleIsPlaying = function () {
      setPlayedDuration((duration) => duration + 1);
    };
    if (isPlayed) {
      interval = setInterval(handleIsPlaying, 1000);
    } else {
      clearInterval(interval);
      getBlobDuration(blobUrl).then((seconds) => setDuration(seconds));
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlayed]);
  const playAudio = () => {
    audioRef.current.play();
    setIsPlayed(true);
  };
  const pauseVideo = () => {
    audioRef.current.pause();
    setIsPlayed(false);
  };
  return (
    <div>
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          <div className="cursor-pointer">
            {isPlayed ? (
              <div onClick={pauseVideo}>
                <Pause />
              </div>
            ) : (
              <div onClick={playAudio}>
                <Play />
              </div>
            )}
          </div>
          <div>
            <Slider
              step={1}
              defaultValue={[0]}
              value={[(playedDuration / duration) * 100]}
              max={100}
              className="min-w-32 max-w-64"
            />
          </div>
        </div>
        <div className="text-[11px] text-white mx-8">
          {formatTime((duration - playedDuration).toFixed(0))}
        </div>
      </div>
      <audio src={blobUrl} hidden ref={audioRef} />
    </div>
  );
}
