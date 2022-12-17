describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("add E Resep Racikan", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1)").click()
    cy.wait(5000)
    cy.get(".px-10 > .d-flex > :nth-child(4)").click()
    cy.get(".card-toolbar > div > .btn").click()
    cy.get("#racikan").click()
    cy.get(".d-flex > .btn-primary").click()
    cy.get("p > .btn").click()
  })
})

describe("add E Resep Non Racikan", () => {
  it("passes", () => {
    cy.get(".card-toolbar > div > .btn").click()
    cy.get("#non_racikan").click()
    cy.get(".d-flex > .btn-primary").click()
    cy.get("p > .btn").click()
  })
})
