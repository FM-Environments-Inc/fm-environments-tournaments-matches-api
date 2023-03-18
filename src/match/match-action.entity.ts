import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { TABLE_NAMES } from '../config/constants/table-names';
import { MATCH_ACTION_TYPES } from '../config/constants';
import { Match } from './match.entity';

@Entity({ name: TABLE_NAMES.MATCH_ACTIONS })
@ObjectType()
export class MatchAction {
  @PrimaryGeneratedColumn('increment')
  @Field()
  id?: number;

  @Column()
  @Field()
  environment: string;

  @Column()
  @Field()
  team: string;

  @Column()
  @Field()
  player: string;

  @Column()
  @Field()
  type: MATCH_ACTION_TYPES;

  @Column()
  @Field()
  minute: number = 0;

  @Column({ type: 'int' })
  matchId: number;

  @Field(() => Match)
  @ManyToOne(() => Match)
  @JoinColumn({ name: 'matchId' })
  match?: Match;

  @CreateDateColumn({ type: 'timestamp' })
  @Field()
  createdAt?: Date;
}
