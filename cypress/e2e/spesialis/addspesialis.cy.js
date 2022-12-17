describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("add spesialis", () => {
  it("passes", () => {
    cy.get('#kt_aside_logo').click()
    cy.get('[href="/specialist"] > .menu-icon > svg').click()
    cy.get('#create_name').type("test spesialis")
    cy.get('.card-body > .btn').click()
    cy.get('p > .btn').click()
  })
})