const urlTickets = 'http://localhost:3000/tickets';

describe('Testes relacionados a tickets', () => {
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
});
