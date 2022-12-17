describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("add pengguna", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/user"] > .menu-icon > svg').click()
    cy.get(
      ":nth-child(1) > :nth-child(7) > .d-flex > .sc-fEOsli > .btn"
    ).click()
    cy.get("#name").clear().type("edit cypress pengguna")
    cy.get("#sip_number").clear().type("43141421")
    cy.get(".btn-primary").click()
    cy.wait(10000)
    cy.get("p > .btn").click()
    cy.get('[href="/user"] > .menu-icon > svg').click()
  })
})
