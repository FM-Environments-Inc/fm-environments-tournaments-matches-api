import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { TABLE_NAMES } from '../config/constants/table-names';

@Entity({ name: TABLE_NAMES.MATCHES })
@ObjectType()
export class Match {
  @PrimaryGeneratedColumn('increment')
  @Field()
  id: number;

  @Column()
  @Field()
  environment: string;

  @Column()
  @Field()
  team1: string;

  @Column()
  @Field()
  team2: string;

  @Column()
  @Field()
  team1Goals: number = 0;

  @Column()
  @Field()
  team2Goals: number = 0;

  @Column({ nullable: true })
  @Field({ nullable: true })
  winner: string | null = null;

  @Column({ nullable: true })
  @Field({ nullable: true })
  finishedAt: Date | null = null;

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  createdAt: Date;
}
