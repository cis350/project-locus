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

    cy.get('button').contains('Log-in').click();
    cy.get('h1').contains('Welcome to Locus!').should('not.exist');
    cy.get('button').contains('Register').should('not.exist');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('h1').contains('Log-in').should('be.visible');
    cy.get('label').contains('Email').should('be.visible');
    cy.get('label').contains('Password').should('be.visible');
    cy.get('button').contains('Locus').click();
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
  });

  it('login empty field', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Log-in').should('be.visible');
    cy.get('button').contains('Register').should('be.visible');
    cy.get('button').contains('Log-in').click();
    cy.get('button').contains('Log-in').click();
    cy.get('div').contains('Please enter both your email and password.').should('be.visible');
  });
  it('invalid login', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Log-in').should('be.visible');
    cy.get('button').contains('Log-in').click();
    cy.get('input[type="email"]').type('test').should('have.value', 'test');
    cy.get('input[type="password"]').type('test').should('have.value', 'test');
    cy.get('button').contains('Log-in').click();
    cy.get('div').contains('Email or/and password invalid.').should('be.visible');
  });
});

describe('test register', () => {
  it('going to register page and returning to welcome page', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Log-in').should('be.visible');
    cy.get('button').contains('Register').should('be.visible');

    cy.get('button').contains('Register').click();
    cy.get('h1').contains('Welcome to Locus!').should('not.exist');
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('h1').contains('Register').should('be.visible');
    cy.get('label').contains('First name').should('be.visible');
    cy.get('label').contains('Last name').should('be.visible');
    cy.get('label').contains('Email').should('be.visible');
    cy.get('label').contains('Password').should('be.visible');
    cy.get('label').contains('Verify password').should('be.visible');
    cy.get('button').contains('Locus').click();
    cy.get('h1').contains('Welcome to Locus!').should('be.visible');
  });

  it('fill out all 5 fields error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click();
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('input[type="first_name"]').type('James');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('input[type="last_name"]').type('Doh');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('input[type="email"]').type('test@gmail');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('input[type="pwd"]').type('abc123');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Please fill out all 5 fields below.');
    cy.get('input[type="pwd_cfm"]').type('abc123');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Please fill out all 5 fields below.').should('not.exist');
  });

  it('invalid email error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click();
    cy.get('input[type="first_name"]').type('James');
    cy.get('input[type="last_name"]').type('Doh');
    cy.get('input[type="email"]').type('test@gmail');
    cy.get('input[type="pwd"]').type('abc123');
    cy.get('input[type="pwd_cfm"]').type('abc123');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Invalid email.');
  });

  it('passwords do not match error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click();
    cy.get('input[type="first_name"]').type('James');
    cy.get('input[type="last_name"]').type('Doh');
    cy.get('input[type="email"]').type('test@gmail.com');
    cy.get('input[type="pwd"]').type('abc123');
    cy.get('input[type="pwd_cfm"]').type('abc321');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Please re-verify your password.');
  });

  it('passwords too short error', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click();
    cy.get('input[type="first_name"]').type('James');
    cy.get('input[type="last_name"]').type('Doh');
    cy.get('input[type="email"]').type('test@gmail.com');
    cy.get('input[type="pwd"]').type('abc');
    cy.get('input[type="pwd_cfm"]').type('abc');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Password must be at least 5 characters.');
  });

  it('register user successful', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click();
    cy.get('input[type="first_name"]').type('James');
    cy.get('input[type="last_name"]').type('Doh');
    cy.get('input[type="email"]').type('test@gmail.com');
    cy.get('input[type="pwd"]').type('abc123');
    cy.get('input[type="pwd_cfm"]').type('abc123');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Account created successfully!');
  });
});

describe('test register and login', () => {
  it('register user then login', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Register').click();
    cy.get('input[type="first_name"]').type('James');
    cy.get('input[type="last_name"]').type('Doh');
    cy.get('input[type="email"]').type('test@gmail.com');
    cy.get('input[type="pwd"]').type('abc123');
    cy.get('input[type="pwd_cfm"]').type('abc123');
    cy.get('button').contains('Register').click();
    cy.get('div').contains('Account created successfully!');
    cy.get('button').contains('Log-in').click();
    cy.get('input[type="email"]').type('test@gmail.com');
    cy.get('input[type="password"]').type('abc123');
    cy.get('button').contains('Log-in').click();
    cy.get('button').contains('Locus').should('be.visible');
    cy.get('button').contains('Home').should('be.visible');
    cy.get('button').contains('Chats').should('be.visible');
    cy.get('button').contains('Club').should('be.visible');
    cy.get('button').contains('Projects').should('be.visible');
  });
});
