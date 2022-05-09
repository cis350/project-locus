/* eslint-disable no-undef */
// Login.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

// Tests end-to-end of login.js and register.js

describe('test failed login', () => {
  it('going to login page and returning to welcome page', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Log-in').should('be.visible');
    cy.get('button').contains('Register').should('be.visible');

    cy.get('button').contains('Log-in').click({ force: true });
    cy.get('h1').contains('Welcome to Locus!').should('not.exist');
    cy.get('button').contains('Register').should('not.exist');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('h1').contains('Log-in').should('be.visible');
    cy.get('label').contains('Email').should('be.visible');
    cy.get('label').contains('Password').should('be.visible');
    cy.get('button').contains('Locus').click({ force: true });
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
  });

  it('login empty field', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Log-in').should('be.visible');
    cy.get('button').contains('Register').should('be.visible');
    cy.get('button').contains('Log-in').click({ force: true });
    cy.get('button').contains('Log-in').click({ force: true });
    cy.get('div').contains('Please enter both your email and password.').should('be.visible');
  });
  it('invalid login', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Log-in').should('be.visible');
    cy.get('button').contains('Log-in').click({ force: true });
    cy.get('[type="email"]').type('test', { force: true }).should('have.value', 'test');
    cy.get('[type="password"]').type('test', { force: true }).should('have.value', 'test');
    cy.get('button').contains('Log-in').click({ force: true });
    cy.get('div').contains('Email or/and password invalid.').should('be.visible');
  });
});

describe('test register and login', () => {
  it('going to register page and returning to welcome page', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Log-in').should('be.visible');
    cy.get('button').contains('Register').should('be.visible');

    cy.get('button').contains('Register').click({ force: true });
    cy.get('h1').contains('Welcome to Locus!').should('not.exist');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('h1').contains('Register').should('be.visible');
    cy.get('label').contains('First name').should('be.visible');
    cy.get('label').contains('Last name').should('be.visible');
    cy.get('label').contains('Email').should('be.visible');
    cy.get('label').contains('Password').should('be.visible');
    cy.get('label').contains('Verify password').should('be.visible');
    cy.get('button').contains('Locus').click({ force: true });
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
  });

  it('fill out all 5 fields error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click({ force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('[data-testid="firstname-input"]').type('James', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('[data-testid="lastname-input"]').type('Doh', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('[data-testid="email-input"]').type('test@gmail', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('[data-testid="password-input"]').type('abc123', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('[data-testid="verpassword-input"]').type('abc123', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Please fill out all 5 fields below.').should('not.exist');
  });

  it('invalid email error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click({ force: true });
    cy.get('[data-testid="firstname-input"]').type('James', { force: true });
    cy.get('[data-testid="lastname-input"]').type('Doh', { force: true });
    cy.get('[data-testid="email-input"]').type('test@gmail', { force: true });
    cy.get('[data-testid="password-input"]').type('abc123', { force: true });
    cy.get('[data-testid="verpassword-input"]').type('abc123', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Password must have at least one upper case.');
  });

  it('passwords do not match error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click({ force: true });
    cy.get('[data-testid="firstname-input"]').type('James', { force: true });
    cy.get('[data-testid="lastname-input"]').type('Doh', { force: true });
    cy.get('[data-testid="email-input"]').type('test@gmail.com', { force: true });
    cy.get('[data-testid="password-input"]').type('abc123', { force: true });
    cy.get('[data-testid="verpassword-input"]').type('abc321', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Please re-verify your password.');
  });

  it('passwords too short error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click({ force: true });
    cy.get('[data-testid="firstname-input"]').type('James', { force: true });
    cy.get('[data-testid="lastname-input"]').type('Doh', { force: true });
    cy.get('[data-testid="email-input"]').type('test@gmail.com', { force: true });
    cy.get('[data-testid="password-input"]').type('abc', { force: true });
    cy.get('[data-testid="verpassword-input"]').type('abc', { force: true });
    cy.get('button').contains('Register').click({ force: true });
    cy.get('div').contains('Password must be at least 5 characters.');
  });

  it('register user successful then login', () => {
    cy.visit('http://localhost:3000');
    // cy.get('button').contains('Register').click({ force: true });
    // cy.get('[data-testid="firstname-input"]').type('James', { force: true });
    // cy.get('[data-testid="lastname-input"]').type('Doh', { force: true });
    // cy.get('[data-testid="email-input"]').type('sss@gmail.com', { force: true });
    // cy.get('[data-testid="password-input"]').type('Abc123!', { force: true });
    // cy.get('[data-testid="verpassword-input"]').type('Abc123!', { force: true });
    // cy.get('button').contains('Register').click({ force: true });
    // cy.get('div').contains('Account created successfully!');

    cy.get('button').contains('Log-in').click({ force: true });
    cy.get('[type="email"]').type('sss@gmail.com', { force: true });
    cy.get('[type="password"]').type('Abc123!', { force: true });

    cy.get('button').contains('Log-in').click({ force: true });
    cy.get('button').contains('Locus').should('be.visible');
    cy.get(':nth-child(2) > .navbar-button').contains('Home').should('be.visible');
    cy.get('[href="/chats/62789f4f2288f8c741041d9c"] > .navbar-button').contains('Chats').should('be.visible');
    cy.get('[href="/clubs/62789f4f2288f8c741041d9c"] > .navbar-button').contains('Club').should('be.visible');
    cy.get('[href="/projects/clubs/62789f4f2288f8c741041d9c"] > .navbar-button').contains('Projects').should('be.visible');
  });
});
