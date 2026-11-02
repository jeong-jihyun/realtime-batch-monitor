import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BatchJob } from '../batch/batch-job.entity';
@WebSocketGateway({cors:{origin:process.env.CORS_ORIGIN ?? 'http://localhost:5173'}})
export class RealtimeGateway {
 @WebSocketServer() server!:Server;
 publish(job:BatchJob) { this.server?.emit('batch:progress',{id:job.id,name:job.name,status:job.status,total:job.total,processed:job.processed,createdAt:job.createdAt}); }
}
