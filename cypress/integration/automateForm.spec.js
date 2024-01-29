/// <reference types="Cypress" />

describe('Automate Form Submission', () => {
    it('should fill out the form and submit', () => {
      // Visit the page
      cy.visit('your-page-url');
  
      // Fill out the salary input
      cy.get('#salario').type('5000');
  
      // Click on the "Add Salary" button
      cy.get('button:contains("Adicionar Salario")').click();
  
      // Fill out the expense form
      cy.get('#nomeGasto').type('Electricity Bill');
      cy.get('#tipoGasto').select('debito');
      cy.get('#valorGasto').type('100');
      cy.get('#mesGasto').type('2024-01');
      
      // Add specific steps for credit expenses if needed
      
      // Click on the "Add Expense" button
      cy.get('button:contains("Adicionar Gasto")').click();
  
      // Add more assertions as needed to verify the success of the form submission
      // For example, you might want to check if the expense is added to a list or if the total is updated.
  
      // Wait for a while to see the result (you might need to adjust the time)
      cy.wait(3000);
    });
  });
  