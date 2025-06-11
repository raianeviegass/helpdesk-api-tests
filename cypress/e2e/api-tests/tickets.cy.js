const urlTickets = 'http://localhost:3000/tickets';

describe('Testes relacionados a tickets', () => {
  it('Deve retornar status 200 para a busca de tickets', () => {
    cy.request('GET', urlTickets)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.greaterThan(0);
      });
  });

  it('Deve retornar status 200 para a busca de um ticket específico', () => {
    cy.request('GET', urlTickets)
      .then((response) => {
        const items = response.body;
        let randomItem = [Math.floor(Math.random() * items.length)];
        if (randomItem == 0) {
          randomItem = Number(randomItem) + 1;
        }
        cy.request('GET', urlTickets + randomItem)
          .then((response) => {
            const specificTicketId = response.body.id;
            const specificTicketName = response.body.name;

            expect(response.body).to.have.property('id', specificTicketId);
            expect(response.body).to.have.property('name', specificTicketName);
          });
      });
  });

  it('Deve retornar status 201 para a criação de ticket', () => {
    cy.request('GET', urlTickets)
      .then((response) => {
        const items = response.body;
        let randomItem = [Math.floor(Math.random() * items.length)];
        if (randomItem == 0) {
          randomItem = Number(randomItem) + 1;
        }
        cy.request({
          method: 'POST',
          url: urlTickets + randomItem,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id', response.body.id);
            expect(response.body).to.have.property('userId', response.body.userId);
            expect(response.body).to.have.property('description');
          });
      });
  });

  it('Deve retornar status 400 para a criação de ticket - Campos vazios', () => {
    const emptyFieldsTicket = {
      name: '',
      description: '',
    };
    cy.request({
      method: 'POST',
      url: urlTickets,
      failOnStatusCode: false,
      body: emptyFieldsTicket,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
      });
  });

  it('Deve retornar status 400 para a criação de ticket - Campo Description vazio', () => {
    const emptyDescriptionFieldTicket = {
      description: '',
    };
    cy.request({
      method: 'POST',
      url: urlTickets,
      failOnStatusCode: false,
      body: emptyDescriptionFieldTicket,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.not.have.property('description');
        expect(response.body).to.have.property('error', 'The fields userId and description are required.');
      });
  });

  it('Deve retornar 200 e atualizar um ticket existente', () => {
    cy.request('GET', urlTickets)
      .then((response) => {
        const items = response.body;
        let randomItem = [Math.floor(Math.random() * items.length)];
        if (randomItem == 0) {
          randomItem = Number(randomItem) + 1;
        }
        cy.request('GET', urlTickets + randomItem)
          .then((response) => {
            const specificTicketId = response.body.id;

            const updatedTicket = {
              id: specificTicketId,
            }

            cy.request({
              method: 'PUT',
              url: urlTickets + updatedTicket.id,
              body: updatedTicket,
              headers: {
                'Content-Type': 'application/json',
              },
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.Ticket).to.have.property('id', updatedTicket.id);
              expect(response.body).to.have.property('message', 'Ticket updated successfully.');
            });
          });
      });
  });

  it('Deve retornar 404 e não encontrar um ticket para atualizar', () => {
    cy.request('GET', urlTickets)
      .then((response) => {
        const idsExistentes = response.body.map(u => u.id);
        cy.log(idsExistentes);
        let idInvalido = Math.max(...idsExistentes) + 1;
        while (idsExistentes.includes(idInvalido)) {
          idInvalido++;
        }
        cy.request({
          method: 'GET',
          url: urlTickets + `${idInvalido}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(404);
          expect(response.body).to.have.property('error', 'Ticket not found.');
          cy.log(`ID inexistente: ${idInvalido}`);
        });
      });
  });

  it('Deve retornar 200 e excluir um ticket', () => {
    cy.request('GET', urlTickets)
      .then((response) => {
        const items = response.body;
        let randomItem = [Math.floor(Math.random() * items.length)];
        if (randomItem == 0) {
          randomItem = Number(randomItem) + 1;
        }
        cy.request('GET', urlTickets + randomItem)
        cy.request({
          method: 'DELETE',
          url: urlTickets + randomItem,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
  });

  it('Deve retornar 404 e não encontrar um ticket para excluir', () => {
    cy.request('GET', urlTickets)
      .then((response) => {
        const idsExistentes = response.body.map(u => u.id);
        cy.log(idsExistentes);
        let idInvalido = Math.max(...idsExistentes) + 1;
        while (idsExistentes.includes(idInvalido)) {
          idInvalido++;
        }
        cy.request({
          method: 'DELETE',
          url: urlTickets + `${idInvalido}`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(404);
          expect(response.body).to.have.property('error', 'Ticket not found.');
          cy.log(`ID inexistente: ${idInvalido}`);
        });
      });
  });
});
