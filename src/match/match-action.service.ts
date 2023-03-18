import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MatchAction } from './match-action.entity';
import { CreateMatchActions } from './dto/input/create-match-actions.input';
import { MATCH_ACTION_TYPES } from '../config/constants';
import { IGetParticipantActions } from './match.interface';
import { GetMatchActionsArgs } from './dto/args/get-match-actions.args';

@Injectable()
export class MatchActionService {
  constructor(
    @InjectRepository(MatchAction)
    private matchActionRepository: Repository<MatchAction>,
  ) {}

  public async create(
    createMatchActionsInput: Array<CreateMatchActions>,
  ): Promise<Array<MatchAction>> {
    const newMatchActions = this.matchActionRepository.create(
      createMatchActionsInput,
    );
    await this.matchActionRepository.insert(newMatchActions);
    return newMatchActions;
  }

  public get(
    getMatchActionsArgs: GetMatchActionsArgs,
  ): Promise<Array<MatchAction>> {
    const { match } = getMatchActionsArgs;
    return this.matchActionRepository.find({
      where: {
        match,
      },
    });
  }

  public getParticipationActions(
    participants: Array<IGetParticipantActions>,
  ): Array<MatchAction> {
    return participants.map((participant) => ({
      ...participant,
      type: MATCH_ACTION_TYPES.PARTICIPATION,
      minute: 0,
    }));
  }
}
