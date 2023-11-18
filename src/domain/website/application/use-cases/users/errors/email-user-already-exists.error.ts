import { UseCaseError } from '@/core/types/use-case-error';

class EmailUserAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('E-mail already exists');
  }
}

export default EmailUserAlreadyExistsError;
