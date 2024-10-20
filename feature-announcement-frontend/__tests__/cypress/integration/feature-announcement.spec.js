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

  it('displays no features when there are none', () => {
    // Mock the /features API call with an empty array
    cy.intercept('GET', '/features', {
      body: []
    }).as('getFeaturesEmpty');

    // Reload the page to apply the new mock
    cy.reload();

    // Wait for the empty /features request to complete
    cy.wait('@getFeaturesEmpty');

    // Check that no features are displayed
    cy.get('.all-features li').should('not.exist');
    cy.get('.all-features').should('contain', 'All Features');
  });

  it('displays a new feature and keeps it in the list after another WebSocket message', () => {
    // Simulate two WebSocket messages for new features
    cy.window().then((win) => {
      const mockFeature1 = { id: 3, title: 'Feature C', description: 'Description C' };
      const mockFeature2 = { id: 4, title: 'Feature D', description: 'Description D' };
      const mockWebSocket = {
        onmessage: null,
        close: cy.stub(), // Mock the close function
        send: cy.stub(),
      };

      win.WebSocket = function () {
        setTimeout(() => {
          if (mockWebSocket.onmessage) {
            mockWebSocket.onmessage({ data: JSON.stringify(mockFeature1) });
            setTimeout(() => {
              mockWebSocket.onmessage({ data: JSON.stringify(mockFeature2) });
            }, 500);
          }
        }, 500);
        return mockWebSocket;
      };
    });

    // Check that both features are displayed
    cy.get('.all-features').should('contain', 'Feature C');
    cy.get('.all-features').should('contain', 'Feature D');
    cy.get('.feature-announcement').should('contain', 'New Feature: Feature D');
  });
});
