describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("data master radiologi (Tindakan)", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get(":nth-child(5) > span.menu-link").click()
    cy.get(
      ":nth-child(2) > .menu-accordion > span.menu-link > .menu-title"
    ).click()
    cy.get(
      ":nth-child(2) > .menu-accordion > .menu-sub > :nth-child(2) > .menu-link > .menu-title"
    ).click()
    cy.get("#create_name").type("tes tindakan")
    cy.get("div.mb-8 > :nth-child(3) > :nth-child(4)").click()
    cy.get('.card-body > .btn').click()
    cy.get('p > .btn').click()
  })
})
