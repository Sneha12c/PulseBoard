import { Server } from "socket.io";
import http from "http";

class SocketService{
    private io: Server;

    constructor(server: http.Server){
      this.io= new Server(server, {
        cors: {
          origin: "*"
        }
      })
    }

    public connectSocket(){
        this.io.on("connection", (socket)=>{
          console.log(`User connected with ${socket.id}`);
          socket.on("join-poll", (pollId)=>{
            socket.join(pollId);
            console.log(`Joined poll ${pollId} ${socket.id}`);
          })
          socket.on("disconnect", ()=>{
            console.log("User disconnected");
          })
        })
    }

    public emitPollUpdate(pollId: string, data: any){
        this.io.to(pollId).emit("poll-update", data);
    }

    public emitPollAnalytics(pollId: string, analytics: any) {
        this.io.to(pollId).emit("poll-analytics-updated", analytics);
    }
}

export default SocketService;
