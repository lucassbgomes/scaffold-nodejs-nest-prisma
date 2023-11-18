import { UseCaseError } from '@/core/types/use-case-error';

class UsernameUserAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super('Username already exists');
  }
}

export default UsernameUserAlreadyExistsError;
