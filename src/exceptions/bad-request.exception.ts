import { HttpException, HttpStatus } from '@nestjs/common';

import { EXCEPTION_TYPE } from './types';

export class BadRequestException extends HttpException {
  type: EXCEPTION_TYPE;

  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.type = EXCEPTION_TYPE.BAD_REQUEST;
  }
}
