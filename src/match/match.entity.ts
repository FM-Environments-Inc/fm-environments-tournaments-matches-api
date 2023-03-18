import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { TABLE_NAMES } from '../config/constants/table-names';
import { MatchAction } from './match-action.entity';
import { MatchTeam } from './match.interface';

@Entity({ name: TABLE_NAMES.MATCHES })
@Index(['team1'])
@Index(['team2'])
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

  @Field(() => [MatchAction], { nullable: true })
  actions?: MatchAction[] = [];

  @Field(() => [MatchTeam], { nullable: true })
  teams?: MatchTeam[] = [];
}
