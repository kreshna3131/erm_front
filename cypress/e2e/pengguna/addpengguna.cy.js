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
    cy.get(".card-toolbar > .d-flex > .btn").click()
    cy.get("#name").type("test cypress pengguna")
    cy.get('#sip_number').type("3424252252")
    cy.get("#female-radio").click()
    cy.get("#email").type("testcypress@gmail.com")
    cy.get(
      "#role > .css-1jnfszz-control > .css-319lph-ValueContainer > .css-6j8wv5-Input"
    ).click()
    cy.get("#react-select-2-option-0").click()
    cy.get("#specialist_id > .css-1jnfszz-control").click()
    cy.get("#react-select-3-option-0").click()
    cy.get("#active-radio").click()
    cy.get(".btn-primary").click()
    cy.wait(10000)
    cy.get("p > .btn").click()
  })
})
