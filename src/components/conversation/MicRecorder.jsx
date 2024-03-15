import { messagesType } from "@/constants/index.jsx";
import { useLoading } from "@/hooks/useLoading.js";
import useSocket from "@/hooks/useSocket.js";
import { formatTime } from "@/lib/formatTime.js";
// import { blobToBase64 } from "@/lib/blobToBase64.js";
import { ConversationContext } from "@/pages/conversation/page.jsx";
import { Mic, Square, Trash } from "lucide-react";
import { useRef, useState, useEffect, useContext } from "react";

function MicRecorder() {
  const { conversation } = useContext(ConversationContext);
  const { setLoading } = useLoading();
  const { socket } = useSocket();
  const mimeType = "audio/webm";
  const [stream, setStream] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    try {
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
        sendRecord(audioBlob);
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
  const sendRecord = async (audioBlob) => {
    try {
      if (!audioBlob) return;
      setLoading(true);
      socket.emit("send_message", {
        conversationId: conversation?._id,
        message: audioBlob,
        messageType: messagesType.audio,
      });
    } catch (error) {
      console.log(error);
    }
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
