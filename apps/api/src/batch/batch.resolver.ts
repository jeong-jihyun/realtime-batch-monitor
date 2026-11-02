import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BatchJob } from './batch-job.entity';
import { BatchService } from './batch.service';
@Resolver(() => BatchJob)
export class BatchResolver {
 constructor(private readonly batches: BatchService) {}
 @Query(() => [BatchJob], {name:'jobs'}) jobs() { return this.batches.findAll(); }
 @Mutation(() => BatchJob) startBatch(@Args('total',{type:()=>Int,defaultValue:100}) total:number) { return this.batches.start(Math.max(1,Math.min(total,10000))); }
}
