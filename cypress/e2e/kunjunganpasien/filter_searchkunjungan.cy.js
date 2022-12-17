describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("filter kunjungan", () => {
  it("passes", () => {
    cy.wait(4000)
    cy.get(".card-title > .sc-idiyUo").click()
    cy.wait(2000)
    cy.get("#dokter > .css-1jnfszz-control").click()
    cy.wait(2000)
    cy.get("#react-select-3-option-1").click()
    cy.get(".btn-primary").click()
    cy.get(".card-header > svg").click()
  })
})
