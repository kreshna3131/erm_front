describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("radiologi", () => {
  it("passes", () => {
    cy.get('#kt_aside_logo').click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
  })
})