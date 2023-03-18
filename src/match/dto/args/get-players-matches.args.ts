import { IsNotEmpty } from 'class-validator';

export class GetPlayersMatchesArgs {
  @IsNotEmpty()
  playerIds: string[];

  @IsNotEmpty()
  environment: string;
}
