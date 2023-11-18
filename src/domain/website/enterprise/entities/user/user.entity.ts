import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { UserEntityProps, UserEntityRole } from './user.types';

export default class UserEntity extends Entity<UserEntityProps> {
  get firstName() {
    return this.props.firstName;
  }

  set firstName(firstName: string) {
    this.props.firstName = firstName;
    this.touch();
  }

  get lastName() {
    return this.props.lastName;
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName;
    this.touch();
  }

  get username() {
    return this.props.username;
  }

  set username(username: string) {
    this.props.username = username;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get role() {
    return this.props.role;
  }

  set role(role: UserEntityRole) {
    this.props.role = role;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  set deletedAt(deletedAt: Date | undefined | null) {
    this.props.deletedAt = deletedAt;
    this.touch();
  }

  protected touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<UserEntityProps, 'createdAt' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const user = new UserEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? 'CLIENT',
      },
      id,
    );

    return user;
  }
}
