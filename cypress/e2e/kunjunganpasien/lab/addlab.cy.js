describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("add lab", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1)").click()
    cy.get(".px-10 > .d-flex > :nth-child(2)").click()
    cy.get("a > .btn").click()
    cy.get(":nth-child(1) > .mb-6 > .row > :nth-child(7) > .form-check").click()
    cy.get(".col-md-3 > .btn").click()
    cy.get("p > .btn").click()
  })
})
