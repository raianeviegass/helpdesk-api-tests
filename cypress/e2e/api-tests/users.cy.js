import { criarUsuarioFake } from '../../support/utils/faker.utils';
const urlUsers = 'http://localhost:3000/users/';

describe('Testes relacionados a usuários', () => {
  it('Deve retornar status 200 para a busca de usuários', () => {
    cy.request('GET', urlUsers)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.greaterThan(0);
      });
  });

  it('Deve retornar status 200 para a busca de um usuário específico', () => {
    cy.request('GET', urlUsers)
      .then((response) => {
        const items = response.body;
        let randomItem = [Math.floor(Math.random() * items.length)];
        if (randomItem == 0) {
          randomItem = Number(randomItem) + 1;
        }
        cy.request('GET', urlUsers + randomItem)
          .then((response) => {
            expect(response.body).to.have.property('id', response.body.id);
            expect(response.body).to.have.property('name', response.body.name);
            expect(response.body).to.have.property('email', response.body.email);
          });
      });
  });
  it('Deve retornar status 201 para a criação de usuário', () => {
    const usuarioFake = criarUsuarioFake();
    cy.log('Nome: ' + usuarioFake.name);
    cy.log('Email: ' + usuarioFake.email);

    cy.request({
      method: 'POST',
      url: urlUsers,
      body: usuarioFake,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id', response.body.id);
        expect(response.body).to.have.property('name', usuarioFake.name);
        expect(response.body).to.have.property('email', usuarioFake.email);
      });
  });

  it('Deve retornar status 400 para a criação de usuário - Campos vazios', () => {
    const emptyFieldsUser = {
      name: '',
      email: '',
    };
    cy.request({
      method: 'POST',
      url: urlUsers,
      failOnStatusCode: false,
      body: emptyFieldsUser,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.not.have.property('name');
        expect(response.body).to.not.have.property('email');
        expect(response.body).to.have.property('error', 'The fields name and email are required.');
      });
  });

  it('Deve retornar status 400 para a criação de usuário - Campo Nome vazio', () => {
    const emptyNameFieldUser = {
      name: '',
      email: 'emptyname@email.com',
    };
    cy.request({
      method: 'POST',
      url: urlUsers,
      failOnStatusCode: false,
      body: emptyNameFieldUser,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.not.have.property('name');
        expect(response.body).to.not.have.property('email');
        expect(response.body).to.have.property('error', 'The fields name and email are required.');
      });
  });

  it('Deve retornar status 400 para a criação de usuário - Campo Email vazio', () => {
    const emptyEmailFieldUser = {
      name: 'Empty Email',
      email: '',
    };
    cy.request({
      method: 'POST',
      url: urlUsers,
      failOnStatusCode: false,
      body: emptyEmailFieldUser,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.not.have.property('name');
        expect(response.body).to.not.have.property('email');
        expect(response.body).to.have.property('error', 'The fields name and email are required.');
      });
  });

  it('Deve retornar status 409 para a criação de usuário - Usuário existente - Nome e Email mesmo usuário', () => {
    cy.fixture('users').then((usuarios) => {
      const indiceAleatorio = Math.floor(Math.random() * usuarios.length);
      const usuarioAleatorio = usuarios[indiceAleatorio];

      const existingUser = {
        id: usuarioAleatorio.id,
        name: usuarioAleatorio.name,
        email: usuarioAleatorio.email,
      };
    cy.request({
      method: 'POST',
      url: urlUsers,
      failOnStatusCode: false,
      body: existingUser,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
        expect(response.status).to.eq(409);
        expect(response.body).to.not.have.property('name');
        expect(response.body).to.not.have.property('email');
        expect(response.body).to.have.property('error', 'A user with this name or email already exists.');
      });
    });
  });

  it('Deve retornar status 409 para a criação de usuário - Usuário existente - Nome novo e email existente', () => {
    cy.fixture('users').then((usuarios) => {
      const indiceAleatorio = Math.floor(Math.random() * usuarios.length);
      const usuarioAleatorio = usuarios[indiceAleatorio];

      const existingUser = {
        name: 'Alguém',
        email: usuarioAleatorio.email,
      };
      cy.log(existingUser);
      cy.request({
        method: 'POST',
        url: urlUsers,
        failOnStatusCode: false,
        body: existingUser,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          expect(response.status).to.eq(409);
          expect(response.body).to.not.have.property('name');
          expect(response.body).to.not.have.property('email');
          expect(response.body).to.have.property('error', 'A user with this name or email already exists.');
        });
    });
  });

  it('Deve retornar status 409 para a criação de usuário - Usuário existente - Nome existente e email novo', () => {

    cy.fixture('users').then((usuarios) => {
      const indiceAleatorio = Math.floor(Math.random() * usuarios.length);
      const usuarioAleatorio = usuarios[indiceAleatorio];

      const existingUser = {
        name: usuarioAleatorio.name,
        email: 'alguém@email.com',
      };

      cy.request({
        method: 'POST',
        url: urlUsers,
        failOnStatusCode: false,
        body: existingUser,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          expect(response.status).to.eq(409);
          expect(response.body).to.not.have.property('name');
          expect(response.body).to.not.have.property('email');
          expect(response.body).to.have.property('error', 'A user with this name or email already exists.');
        });
    });
  });

    it('Deve retornar 200 e atualizar um usuário existente', () => {
      cy.request('GET', urlUsers)
        .then((response) => {
          const items = response.body;
          let randomItem = [Math.floor(Math.random() * items.length)];
          if (randomItem == 0) {
            randomItem = Number(randomItem) + 1;
          }
          cy.request('GET', urlUsers + randomItem)
            .then((response) => {
              const specificUserId = response.body.id;
              const specificUserName = response.body.name;
              const specificUserEmail = response.body.email;

              const updatedUser = {
                id: specificUserId,
                name: 'Nome Atualizado',
                email: 'emailatualizado@test.com'
              }

              cy.request({
                method: 'PUT',
                url: urlUsers + updatedUser.id,
                body: updatedUser,
                headers: {
                  'Content-Type': 'application/json',
                },
              }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.user).to.have.property('id', updatedUser.id);
                expect(response.body.user).to.have.property('name', updatedUser.name);
                expect(response.body.user.name).to.not.equal(specificUserName);
                expect(response.body.user).to.have.property('email', updatedUser.email);
                expect(response.body.user.email).to.not.equal(specificUserEmail);
                expect(response.body).to.have.property('message', 'User updated successfully.');
              });
            });
        });
    });

    it('Deve retornar 404 e não encontrar um usuário para atualizar', () => {
      cy.request('GET', urlUsers)
        .then((response) => {
          const idsExistentes = response.body.map(u => u.id);
          cy.log(idsExistentes);
          let idInvalido = Math.max(...idsExistentes) + 1;
          while (idsExistentes.includes(idInvalido)) {
            idInvalido++;
          }
          cy.request({
            method: 'GET',
            url: urlUsers + `${idInvalido}`,
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('error', 'User not found.');
            cy.log(`ID inexistente: ${idInvalido}`);
          });
        });
    });

    it('Deve retornar 200 e excluir um usuário', () => {
      cy.request('GET', urlUsers)
        .then((response) => {
          const items = response.body;
          let randomItem = [Math.floor(Math.random() * items.length)];
          if (randomItem == 0) {
            randomItem = Number(randomItem) + 1;
          }
          cy.request('GET', urlUsers + randomItem)
          cy.request({
            method: 'DELETE',
            url: urlUsers + randomItem,
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
    });

    it('Deve retornar 404 e não encontrar um usuário para excluir', () => {
      cy.request('GET', urlUsers)
        .then((response) => {
          const idsExistentes = response.body.map(u => u.id);
          cy.log(idsExistentes);
          let idInvalido = Math.max(...idsExistentes) + 1;
          while (idsExistentes.includes(idInvalido)) {
            idInvalido++;
          }
          cy.request({
            method: 'DELETE',
            url: urlUsers + `${idInvalido}`,
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('error', 'User not found.');
            cy.log(`ID inexistente: ${idInvalido}`);
          });
        });
    });
  });
