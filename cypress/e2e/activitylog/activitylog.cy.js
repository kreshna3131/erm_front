describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Activity Log", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/log-activity"] > .menu-icon > svg').click()
  })
})

describe("Rentang waktu activity log", () => {
  it("passes", () => {
    cy.wait(5000)
    cy.get('.d-grid > .form-control').click()
    cy.wait(3000)
    cy.get('[aria-label="August 23, 2022"]').click()
    cy.wait(3000)
    cy.get('.today').click()
  })
})