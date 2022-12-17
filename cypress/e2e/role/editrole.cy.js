describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("edit Role", () => {
  it("passes", () => {
    cy.get(".cursor-pointer > .d-flex").click()
    cy.get(".menu > :nth-child(4) > .menu-link").trigger("mouseover")
    cy.wait(2000)
    cy.get(":nth-child(4) > .menu-link").click()
    cy.wait(2000)
    cy.get('.card-body > :nth-child(2) > .menu-link').click()
    cy.wait(2000)
    cy.get('thead > tr > :nth-child(1)').click()
    cy.get(':nth-child(1) > :nth-child(4) > .d-flex > .sc-bjUoiL > .btn').click()
    cy.get('#create_note').clear().type("ini adalah role edit otomatis menggunakan cypress")
    cy.get('.btn-primary').click()
    cy.get('p > .btn').click()
    cy.get('.breadcrumb > :nth-child(3) > .text-muted').click()
    // cy.get('.sc-fEOsli > .btn').click()
    // cy.get('[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary').click()
    // cy.get(
    //   ':nth-child(3) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    // ).click()
  })
})
