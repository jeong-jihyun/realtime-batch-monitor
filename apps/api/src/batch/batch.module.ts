import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchJob } from './batch-job.entity';
import { BatchResolver } from './batch.resolver';
import { BatchService } from './batch.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
@Module({imports:[TypeOrmModule.forFeature([BatchJob])],providers:[BatchResolver,BatchService,RealtimeGateway]})
export class BatchModule {}
