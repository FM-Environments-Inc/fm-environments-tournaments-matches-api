import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GrpcMethod } from '@nestjs/microservices';

import { GetTeamsMatchesArgs } from './dto/args/get-teams-matches.args';
import { Match } from './match.entity';

@Controller()
export class MatchesRPCService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
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
}
