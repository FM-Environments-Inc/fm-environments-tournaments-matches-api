import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { TABLE_NAMES } from '../config/constants/table-names';

@Entity({ name: TABLE_NAMES.SEASONS })
@ObjectType()
export class Season {
  @PrimaryColumn()
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

  @Column()
  @Field({ nullable: true })
  finishedAt: Date | null = null;
}
