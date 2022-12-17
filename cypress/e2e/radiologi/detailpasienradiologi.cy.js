describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Detail <pasien></pasien>", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(':nth-child(1) > :nth-child(8) > .d-flex > .btn-light-primary').click()
    cy.get('.btn-light-info').click()
    cy.wait(5000)
    cy.get('.p-10 > .d-flex > .btn').click()
  })
})