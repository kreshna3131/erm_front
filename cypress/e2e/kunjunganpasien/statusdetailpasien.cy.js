describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Ubah status Detail pasien", () => {
  it("passes", () => {
    cy.wait(4000)
    cy.get(".sc-idiyUo > :nth-child(1) > svg").click()
    cy.wait(5000)
    cy.get(".dropdown").click()
    cy.wait(3000)
    cy.get(".w-200px > :nth-child(2) > .d-flex").click()
    cy.get(
      '[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary'
    ).click()
    cy.wait(4000)
    cy.get(
      ':nth-child(3) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})
