import { Observable } from 'rxjs';
import { ObjectType, Field } from '@nestjs/graphql';

import { Match } from './match.entity';

export interface IGetParticipantActions {
  team: string;
  player: string;
  environment: string;
  match?: Match;
  matchId: number;
}

export interface IGetMatchTeamsArgs {
  teamIds: string[];
  environment: string;
  toGetPlayers: boolean;
}

export interface IPlayer {
  _id: string;
  firstName?: string;
  lastName: string;
  evaluation: number;
  features: string;
  role: string;
  position: string;
}

export interface ITeamPlayer {
  position: string;
  isPenaltyShooter?: boolean;
  isFreeKicker?: boolean;
  isCornerKicker?: boolean;
  reference: IPlayer;
}

export interface IGetTeamMatchesData {
  _id: string;
  logo?: string;
  name: string;
  players: ITeamPlayer[];
}

export interface IGetMatchTeamsResponse {
  data: IGetTeamMatchesData[];
}

export interface ITeamRPCService {
  getMatchTeams(
    GetTeamsMatchesArgs: IGetMatchTeamsArgs,
  ): Observable<IGetMatchTeamsResponse>;
}

@ObjectType()
export class MatchTeamPlayerReference {
  @Field()
  _id: string;

  @Field({ nullable: true })
  firstName?: string = '';

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  evaluation?: number;

  @Field({ nullable: true })
  features?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  position?: string;
}

@ObjectType()
export class MatchTeamPlayer {
  @Field()
  position: string;

  @Field({ nullable: true })
  isPenaltyShooter?: boolean = false;

  @Field({ nullable: true })
  isFreeKicker?: boolean = false;

  @Field({ nullable: true })
  isCornerKicker?: boolean = false;

  @Field(() => MatchTeamPlayerReference, { nullable: true })
  reference: MatchTeamPlayerReference;
}

@ObjectType()
export class MatchTeam {
  @Field()
  _id: string;

  @Field({ nullable: true })
  logo?: string;

  @Field()
  name: string;

  @Field(() => [MatchTeamPlayer])
  players: MatchTeamPlayer[];
}

@ObjectType()
export class GetAllMatchesResponse {
  @Field(() => [Match])
  data: Match[];

  @Field()
  total: number;

  @Field()
  page: number = 1;

  @Field()
  limit: number = 20;
}
