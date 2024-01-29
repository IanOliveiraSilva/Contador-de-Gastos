describe('Automate Form Submission', () => {
  it('should fill out the form and submit', () => {
    cy.visit('http://localhost:3000');

    for(let i = 0; i < 50; i++){
      cy.get('#nomeGasto').type('Electricity Bill');
      cy.get('#tipoGasto').select('debito');
      cy.get('#valorGasto').type('100');
      cy.get('#mesGasto').type('2024-01');
  
      cy.contains('button', 'Adicionar Gasto').click();
    }
  });
});
