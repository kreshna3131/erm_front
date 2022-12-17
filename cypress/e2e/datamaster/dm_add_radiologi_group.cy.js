describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("data master radiologi (Group)", () => {
  it("passes", () => {
    cy.get('#kt_aside_logo').click()
    cy.get(':nth-child(5) > span.menu-link').click()
    cy.get(':nth-child(2) > .menu-accordion > span.menu-link > .menu-title').click()
    cy.get(':nth-child(2) > .menu-accordion > .menu-sub > :nth-child(1) > .menu-link > .menu-title').click()
    cy.get('#create_name').type("test grup radiologi")
    cy.get('.card-body > .btn').click()
    cy.get('p > .btn').click()
  })
})