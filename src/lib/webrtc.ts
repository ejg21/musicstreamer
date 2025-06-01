// lib/webrtc.ts
import Peer from "simple-peer";
import { io, Socket } from "socket.io-client";

export interface RoomContext {
  socket: Socket;
  peers: Record<string, Peer>;
  roomId: string;
  isHost: boolean;
}

export function joinRoom({
  roomId,
  isHost,
  stream,
  onRemoteStream,
}: {
  roomId: string;
  isHost: boolean;
  stream?: MediaStream;
  onRemoteStream?: (stream: MediaStream) => void;
}): RoomContext {
  const socket = io("https://musicsocketserver.onrender.com");
  const peers: Record<string, Peer> = {};

  socket.emit("join-room", roomId);

  socket.on("user-joined", (id: string) => {
    if (!isHost || !stream) return;
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("signal", { to: id, data });
    });
    peers[id] = peer;
  });

  socket.on("signal", ({ from, data }) => {
    if (peers[from]) {
      peers[from].signal(data);
    } else {
      const peer = new Peer({ initiator: false, trickle: false });
      peer.on("signal", (data) => {
        socket.emit("signal", { to: from, data });
      });
      peer.on("stream", (stream) => {
        onRemoteStream?.(stream);
      });
      peer.signal(data);
      peers[from] = peer;
    }
  });

  return { socket, peers, roomId, isHost };
}
