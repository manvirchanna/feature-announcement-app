describe('FeatureAnnouncement Component', () => {
  beforeEach(() => {
    // Mock the /features API call with some data
    cy.intercept('GET', '/features', {
      body: [
        { id: 1, title: 'Feature A', description: 'Description A' },
        { id: 2, title: 'Feature B', description: 'Description B' }
      ]
    }).as('getFeatures');

    // Visit the page containing the FeatureAnnouncement component
    cy.visit('/');
  });

  it('renders fetched features correctly', () => {
    // Wait for the /features request to complete
    cy.wait('@getFeatures');

    // Check that the fetched features are displayed
    cy.get('.all-features').should('contain', 'Feature A');
    cy.get('.all-features').should('contain', 'Feature B');
  });

  it('handles new feature from WebSocket', () => {
    // Simulate a WebSocket message for a new feature
    cy.window().then((win) => {
      const mockFeature = { id: 3, title: 'Feature C', description: 'Description C' };
      const mockWebSocket = {
        onmessage: null,
        close: cy.stub(), // Mock the close function
        send: cy.stub(),
      };

      // Override the WebSocket object
      win.WebSocket = function () {
        setTimeout(() => {
          if (mockWebSocket.onmessage) {
            mockWebSocket.onmessage({ data: JSON.stringify(mockFeature) });
          }
        }, 500);
        return mockWebSocket;
      };
    });

    // Check that the new feature is displayed
    cy.get('.all-features').should('contain', 'Feature C');
    cy.get('.feature-announcement').should('contain', 'New Feature: Feature C');
  });
});
