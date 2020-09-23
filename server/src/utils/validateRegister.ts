import { UsernamePasswordInput } from "../resolvers/types/UsernamePasswordInput"

export const validadeRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email'
      }
    ]
  }

  if (options.username.length < 2) {
    return [
      {
        field: 'username',
        message: 'username must have 2 characters or more'
      }
    ]
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include an @'
      }
    ]
  }

  if (options.password.length < 3) {
    return [
      {
        field: 'password',
        message: 'your password must have 3 characters or more'
      }
    ]

  }

  return null;
}