import { IsNotEmpty } from 'class-validator';

export class GetTeamsMatchesArgs {
  @IsNotEmpty()
  teamIds: string[];

  @IsNotEmpty()
  environment: string;
}
