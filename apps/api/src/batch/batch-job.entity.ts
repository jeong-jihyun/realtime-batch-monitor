import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
@ObjectType()
@Entity('batch_jobs')
export class BatchJob {
 @Field(() => ID) @PrimaryGeneratedColumn('uuid') id!: string;
 @Field() @Column({default:'Sample import batch'}) name!: string;
 @Field() @Column({default:'queued'}) status!: string;
 @Field(() => Int) @Column({type:'integer',default:100}) total!: number;
 @Field(() => Int) @Column({type:'integer',default:0}) processed!: number;
 @Field() @CreateDateColumn() createdAt!: Date;
}
