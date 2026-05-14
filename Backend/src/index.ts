import { createServer} from "node:http";
import { applicationHandler } from "./app";
import dotenv from 'dotenv';
dotenv.config();
import connectdb from "./db";

async function main() {
    try{
        const server = createServer(applicationHandler());
        const PORT:number = process.env.PORT ? +process.env.PORT : 8000;
        
        await connectdb();
        
        server.listen(PORT , ()=>{
            console.log(`Server is listening on PORT ${PORT}`);
        })

    } catch(err){
        console.log("error", err);
        throw err;
    }
}

main();
