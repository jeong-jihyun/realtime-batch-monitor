import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchJob } from './batch-job.entity';
import { RealtimeGateway } from '../realtime/realtime.gateway';
@Injectable()
export class BatchService {
 private readonly active = new Set<string>();
 constructor(@InjectRepository(BatchJob) private readonly jobs:Repository<BatchJob>,private readonly realtime:RealtimeGateway) {}
 findAll() { return this.jobs.find({order:{createdAt:'DESC'},take:50}); }
 async start(total:number) {
  const job=await this.jobs.save(this.jobs.create({name:`Import batch · ${new Date().toLocaleTimeString()}`,status:'running',total,processed:0}));
  this.realtime.publish(job);
  void this.run(job.id).catch(error=>console.error('Batch failed',error));
  return job;
 }
 private async run(id:string) {
  if(this.active.has(id)) return; this.active.add(id);
  try { while(true) {
   const job=await this.jobs.findOneBy({id}); if(!job||job.status!=='running') break;
   job.processed=Math.min(job.processed+Math.max(1,Math.ceil(job.total/25)),job.total);
   if(job.processed>=job.total) job.status='completed';
   const saved=await this.jobs.save(job); this.realtime.publish(saved);
   if(saved.status==='completed') break;
   await new Promise(resolve=>setTimeout(resolve,250));
  }} finally { this.active.delete(id); }
 }
}
