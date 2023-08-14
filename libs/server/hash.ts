const bcrypt = require('bcrypt');

const saltRounds = 10;

export function hashPassword(plainPassword: string): string {
  return bcrypt.hash(plainPassword, saltRounds).then(function (hash: string) {
    return hash;
  });
}

export function isSamePassword(
  plainPassword: string,
  hashedPassword: string
): boolean {
  return bcrypt
    .compare(plainPassword, hashedPassword)
    .then(function (result: boolean) {
      return result;
    });
}
