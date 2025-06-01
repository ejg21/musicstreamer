import { useEffect, useRef, useState } from "react";
import { joinRoom, RoomContext } from "./webrtc";

interface UseRoomOptions {
  roomId: string;
  isHost: boolean;
  stream?: MediaStream;
}

export function useRoom({ roomId, isHost, stream }: UseRoomOptions) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [socket, setSocket] = useState<RoomContext["socket"] | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const { socket } = joinRoom({
      roomId,
      isHost,
      stream,
      onRemoteStream: (remoteStream) => {
        if (!isHost && audioRef.current) {
          audioRef.current.srcObject = remoteStream;
          audioRef.current.play();
        }
      },
    });

    setSocket(socket);

    if (!isHost && audioRef.current) {
      audioRef.current.controls = false;
    }

    socket.on("sync-track", ({ trackId, time }) => {
      setCurrentTrack(trackId);
      setCurrentTime(time);
      if (!isHost && audioRef.current) {
        audioRef.current.src = `/api/track/${trackId}`;
        audioRef.current.currentTime = time;
        audioRef.current.play();
      }
    });

    socket.on("queue-update", (newQueue: string[]) => {
      setQueue(newQueue);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, isHost, stream]);

  const emitTrack = (trackId: string, time: number) => {
    if (!isHost || !socket) return;
    socket.emit("sync-track", { trackId, time });
    setCurrentTrack(trackId);
    setCurrentTime(time);
  };

  const addToQueue = (trackId: string) => {
    if (!socket) return;
    socket.emit("request-track", trackId);
  };

  const startRoom = () => {
    if (!socket) return;
    socket.emit("room:start", roomId);
  };

  return {
    currentTrack,
    currentTime,
    queue,
    emitTrack,
    addToQueue,
    audioRef,
    isHost,
    startRoom,
  };
}
