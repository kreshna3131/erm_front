describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("add rehab", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1)").click()
    cy.wait(2000)
    cy.get(".px-10 > .d-flex > :nth-child(5)").click()
    cy.wait(2000)
    cy.get("a > .btn").click()
    cy.wait(2000)
    cy.get(":nth-child(1) > .row > :nth-child(10) > .d-flex").click()
    cy.wait(2000)
    cy.get(":nth-child(15) > .d-flex").click()
    cy.get(".col-md-3 > .btn").click()
    cy.wait(4000)
    cy.get("p > .btn").click()
  })
})
