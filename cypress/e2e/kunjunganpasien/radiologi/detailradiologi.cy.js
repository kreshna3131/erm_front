describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("detail radiologi", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1)").click()
    cy.get(".px-10 > .d-flex > :nth-child(3)").click()
    cy.get(
      ":nth-child(1) > :nth-child(7) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(":nth-child(1) > :nth-child(3) > .d-flex > .form-control").type("1")
    cy.get(":nth-child(1) > :nth-child(3) > .d-flex > .sc-idiyUo").click()
    cy.wait(3000)
    cy.get(":nth-child(1) > :nth-child(3) > .d-flex > .form-control").type("2")
    cy.get(":nth-child(1) > :nth-child(3) > .d-flex > .sc-idiyUo").click()
    cy.get(".align-items-center > .sc-idiyUo").click()
  })
})
