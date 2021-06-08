import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import { ValidationError as ExpressValidationError } from 'express-validation';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import BaseError from 'server/utils/errors/BaseError';
import { createErrorResponse } from 'server/utils/functions';
import errors from 'server/utils/constants/errors';

type HandledError = BaseError | ExpressValidationError | SequelizeValidationError | Error;

const errorHandler = (err: HandledError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BaseError) {
    return res
      .status(err.statusCode)
      .json(createErrorResponse(err.statusCode, err.type, undefined, err.message));
  }

  if (err instanceof ExpressValidationError) {
    const param = Object.keys(err.details[0])[0];
    const msg = err.details[0][param];
    return res
      .status(err.statusCode)
      .json(createErrorResponse(err.statusCode, errors.validation, param, msg));
  }

  if (err instanceof SequelizeValidationError) {
    const msg = err.errors[0].message;
    return res
      .status(BAD_REQUEST)
      .json(createErrorResponse(BAD_REQUEST, errors.validation, undefined, msg));
  }

  return res
    .status(INTERNAL_SERVER_ERROR)
    .json(createErrorResponse(INTERNAL_SERVER_ERROR, errors.server, undefined, err.message));
};

export { errorHandler };
