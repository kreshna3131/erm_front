describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Detail permintaan radiologi + ckeditor", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(
      ":nth-child(1) > :nth-child(8) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(
      ":nth-child(1) > :nth-child(5) > .d-flex > .btn-light-primary"
    ).click()
    cy.wait(6000)
    cy.get(".ck-editor__main > .ck").type("test ya")
    cy.get("#finish-radio").click()
    cy.get(".justify-content-end > .btn").click()
    cy.get("p > .btn").click()
    cy.get(".align-items-center > .sc-idiyUo").click()
  })
})
