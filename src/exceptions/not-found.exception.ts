import { HttpException, HttpStatus } from '@nestjs/common';

import { EXCEPTION_TYPE } from './types';

export class NotFoundException extends HttpException {
  type: EXCEPTION_TYPE;

  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.type = EXCEPTION_TYPE.NOT_FOUND;
  }
}
