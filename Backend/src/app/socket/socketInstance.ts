import SocketService from "./socket";

let socketService: SocketService | null = null;

export const setSocketService = (server: SocketService)=>{
    socketService = server;
}

export const getSocketservice = ()=>{
    if (!socketService) {
      throw new Error("SocketService not initialized");
    }
    return socketService;
}
