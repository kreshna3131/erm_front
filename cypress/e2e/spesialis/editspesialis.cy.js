describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("edit spesialis", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/specialist"] > .menu-icon > svg').click()
    cy.get(".sc-idiyUo > .btn").click()
    cy.get(".form > .mb-8 > #create_name").clear().type("edit spesialis")
    cy.get(".d-flex > .btn-primary").click()
    cy.get("p > .btn").click()
  })
})
