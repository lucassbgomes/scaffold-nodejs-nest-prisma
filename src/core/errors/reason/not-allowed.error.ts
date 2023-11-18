import { UseCaseError } from '@/core/types/use-case-error';

class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed');
  }
}

export default NotAllowedError;

const notAllowed = new NotAllowedError();
export const errorNotAllowed = {
  error: notAllowed.constructor,
  message: notAllowed.message,
};
