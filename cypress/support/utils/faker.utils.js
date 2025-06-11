import { faker } from '@faker-js/faker';

export function criarUsuarioFake() {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
  };
}