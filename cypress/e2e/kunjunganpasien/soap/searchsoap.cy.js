describe("login and logout", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Ubah status Soap", () => {
  it("passes", () => {
    cy.wait(4000)
    cy.get(".sc-idiyUo > :nth-child(1) > svg").click()
    cy.wait(4000)
    cy.get(".form-control").type("umum")
  })
})
