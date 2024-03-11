import { blobToBase64 } from "@/lib/blobToBase64.js";
import { Mic, Square, Trash } from "lucide-react";
import { useRef, useState, useEffect } from "react";

function MicRecorder() {
  const mimeType = "audio/webm";
  const [stream, setStream] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [audio, setAudio] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const [duration, setDuration] = useState(0); // State for duration

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else {
      setDuration(0); // Reset duration when not recording
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      setAudio("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      setStream(stream);
      const media = new MediaRecorder(stream, { mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();
      setIsRecording(true);
      let localVideoChunks = [];
      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localVideoChunks.push(event.data);
      };
      setChunks(localVideoChunks);
    } catch (error) {
      console.error(error);
    }
  };
  const stopRecording = async () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: mimeType });
        const audioBase64 = await blobToBase64(audioBlob);
        setAudio(audioBase64);
        setChunks([]);
      };
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    mediaRecorder.current = null;
    setChunks([]);
  };
  const cancelRecording = async () => {
    setIsRecording(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    mediaRecorder.current.onstop = () => {};
    setStream(null);
    mediaRecorder.current = null;
  };
  return (
    <>
      {!isRecording ? (
        <div onClick={startRecording}>
          <Mic />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div>{formatTime(duration)}</div>
          <div onClick={stopRecording}>
            <Square className="text-red-500" />
          </div>
          <div onClick={cancelRecording}>
            <Trash className="text-red-500" />
          </div>
        </div>
      )}
    </>
  );
}

export default MicRecorder;
