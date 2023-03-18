import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GrpcMethod } from '@nestjs/microservices';

import { GetTeamsMatchesArgs } from './dto/args/get-teams-matches.args';
import { GetPlayersMatchesArgs } from './dto/args/get-players-matches.args';
import { Match } from './match.entity';
import { MatchAction } from './match-action.entity';
import { MATCH_ACTION_TYPES } from '../config/constants';

@Controller()
export class MatchesRPCService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectRepository(MatchAction) private matchActionRepository: Repository<MatchAction>,
  ) {}

  @GrpcMethod('MatchesRPCService', 'getTeamsMatches')
  async getTeamsMatches(getTeamsMatchesArgs: GetTeamsMatchesArgs) {
    const { teamIds, environment } = getTeamsMatchesArgs;
    const matches = await this.matchRepository.find({
      where: [
        {
          environment,
          team1: In(teamIds),
        },
        {
          environment,
          team2: In(teamIds),
        },
      ],
    });

    const data = teamIds.map((teamId) => {
      const teamMatches = matches.filter(
        (match) => match.team1 === teamId || match.team2 === teamId,
      );
      const goals = teamMatches.reduce((acc, match) => {
        const isTeam1 = match.team1 === teamId;
        return isTeam1 ? acc + match.team1Goals : acc + match.team1Goals;
      }, 0);

      const goalsAgainst = teamMatches.reduce((acc, match) => {
        const isTeam1 = match.team1 === teamId;
        return isTeam1 ? acc + match.team2Goals : acc + match.team2Goals;
      }, 0);

      return {
        teamId,
        wins: teamMatches.filter((match) => match.winner === teamId).length,
        draws: teamMatches.filter((match) => match.winner === null).length,
        loses: teamMatches.filter(
          (match) => match.winner !== null && match.winner !== teamId,
        ).length,
        goals,
        goalsAgainst,
        goalsDifference: goals - goalsAgainst,
      };
    });

    return {
      data,
    };
  }

  @GrpcMethod('MatchesRPCService', 'getPlayersMatches')
  async getPlayersMatches(getPlayersMatches: GetPlayersMatchesArgs) {
    const { playerIds, environment } = getPlayersMatches;
    // TODO: count, not retrieve
    const actions = await this.matchActionRepository.find({
      where: [
        {
          player: In(playerIds),
          environment,
          type: In([
            MATCH_ACTION_TYPES.GOAL,
            MATCH_ACTION_TYPES.ASSIST,
            MATCH_ACTION_TYPES.PARTICIPATION,
          ]),
        },
      ],
    });

    const data = playerIds.map((playerId) => {
      return {
        playerId,
        matches: actions.filter(
          (action) =>
            action.type === MATCH_ACTION_TYPES.PARTICIPATION && action.player === playerId,
        ).length,
        goals: actions.filter(
          (action) =>
            action.type === MATCH_ACTION_TYPES.GOAL && action.player === playerId,
        ).length,
        assists: actions.filter(
          (action) =>
            action.type === MATCH_ACTION_TYPES.ASSIST && action.player === playerId,
        ).length,
      };
    });

    return {
      data,
    };
  }
}
