describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Detail pasien", () => {
  it("passes", () => {
    cy.wait(4000)
    cy.get(".sc-idiyUo > :nth-child(1) > svg").click()
    cy.get("tbody > :nth-child(1) > :nth-child(7)").click()
    cy.wait(3000)
    cy.get(".sc-idiyUo > .sc-idiyUo").click()
    cy.wait(2000)
    cy.get(".justify-content-end > .btn").click()
    cy.wait(4000)
    cy.get("#riwayat_alergi0")
  })
})
