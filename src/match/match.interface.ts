import { Match } from './match.entity';

export interface IGetParticipantActions {
  team: string;
  player: string;
  environment: string;
  match?: Match;
  matchId: number;
}
