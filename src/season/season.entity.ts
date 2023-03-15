import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { TABLE_NAMES } from '../config/constants/table-names';

@Entity({ name: TABLE_NAMES.SEASONS })
@Index(['sequenceNumber'])
@ObjectType()
export class Season {
  @PrimaryGeneratedColumn('increment')
  @Field()
  id: number;

  @Column()
  @Field()
  environment: string;

  @Column()
  @Field()
  sequenceNumber: number;

  @Column()
  @Field()
  createdAt: Date = new Date();

  @Column({ nullable: true })
  @Field({ nullable: true })
  finishedAt: Date | null = null;
}
