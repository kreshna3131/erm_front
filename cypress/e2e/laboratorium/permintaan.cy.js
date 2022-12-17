describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("permintaan laboratorium", () => {
  it("passes", () => {
    cy.get('#kt_aside_logo').click()
    cy.get(':nth-child(3) > span.menu-link').click()
    cy.get('.hover > .menu-sub > :nth-child(1) > .menu-link > .menu-title').click()
  })
})