//  /* eslint-disable no-undef */
//  describe('Interaction avec la carte et vérification de la réponse de l\'API', () => {
//   beforeEach(() => {
//     // Intercepte toutes les requêtes à l'API correspondant au pattern sans spécifier de latitude/longitude précises
//     cy.intercept('GET', '/api/cities/*').as('apiCall');
//   });

//   it('vérifie que la requête API est faite après un clic sur la carte', () => {
//     cy.visit('http://localhost:3000');

//     cy.get('.Map img').should('be.visible').click();
//     // Si le clic forcé est nécessaire, décommentez la ligne suivante et commentez la précédente
//     // cy.get('.Map img').click({ force: true });

//     cy.intercept('GET', '/api/cities/*').as('getCities');
//     //cy.get('.Map img').click();

//     // Vérifie que le tableau contenant les villes est présent
//     cy.get('#city-table tr').should('exist');
//   });
// });

 /* eslint-disable no-undef */
 describe('Interaction avec la carte et vérification de la réponse de l\'API', () => {
  beforeEach(() => {
    // Intercepte toutes les requêtes à l'API correspondant au pattern sans spécifier de latitude/longitude précises
    cy.intercept('GET', '/api/cities/*').as('apiCall');
    cy.visit('http://localhost:3000');
  });

  it('vérifie que la requête API est faite après un clic sur la carte', () => {
    cy.get('.Map img').should('be.visible').click();
    // Attend que la requête à l'API soit faite après le clic
    //cy.wait('@apiCall');

    // Vérifie que le tableau contenant les villes est présent et contient des données
    cy.get('#city-table tr').should('have.length.greaterThan', 0);
  });

  it('vérifie l\'affichage des marqueurs sur la carte après une réponse API', () => {
    cy.get('.Map img').should('be.visible').click();
    //cy.wait('@apiCall');

    // Remplacer '.marker' par le sélecteur correct pour vos marqueurs sur la carte
    cy.get('.city-marker').should('be.visible');
  });

  it('vérifie l\'affichage des informations des villes dans un panneau latéral et check le hover', () => {
    cy.get('.Map img').should('be.visible').click();
    //cy.wait('@apiCall');

    // Remplacer '#city-info' par le sélecteur correct pour le panneau ou le popup d'informations de la ville
    cy.get('#city-table').should('be.visible').and('contain', 'Nom');
    // Vérifie que les informations clés, comme le nom de la ville et la population, sont affichées
    cy.get('#city-table').should('contain', 'Population');
    
    // Simuler un hover sur un marqueur de la carte
    cy.get('.city-marker').first().trigger('mouseover', { force: true });

    // Attendre un court instant si nécessaire pour permettre à l'UI de réagir
    cy.wait(50);

    // Simuler un hover sur une ligne du tableau
    cy.get('#city-table tr').first().trigger('mouseover', { force: true });

    });
});





