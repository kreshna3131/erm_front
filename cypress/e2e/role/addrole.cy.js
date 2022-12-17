describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("add Role", () => {
  it("passes", () => {
    cy.get(".cursor-pointer > .d-flex").click()
    cy.get(".menu > :nth-child(4) > .menu-link").trigger("mouseover")
    cy.wait(2000)
    cy.get('.card-body > :nth-child(3) > .menu-link').click()
    cy.wait(2000)
    cy.get('.card-body > .text-dark').click()
    cy.wait(2000)
    cy.get("#create_name").type("role cypress")
    cy.wait(2000)
    cy.get("#create_note").type(
      "ini adalah role add otomatis menggunakan cypress"
    )
    cy.wait(2000)
    cy.get(
      ".accordion-collapse > .d-flex > :nth-child(1) > :nth-child(2)"
    ).click()
    cy.wait(2000)
    cy.get(".btn-primary").click()
    cy.wait(5000)
    cy.get("p > .btn").click()
  })
})
