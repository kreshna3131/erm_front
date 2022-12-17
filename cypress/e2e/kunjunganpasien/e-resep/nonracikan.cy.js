describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Detail E Resep Non Racikan", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1)").click()
    cy.get(".px-10 > .d-flex > :nth-child(4)").click()
    cy.get(
      ":nth-child(1) > :nth-child(7) > .d-flex > .btn-light-primary"
    ).click()
    cy.get('.card-toolbar > .d-flex > .btn').click()
    cy.get('.css-1afewf1-control > .css-319lph-ValueContainer').type("para")
    cy.get('#react-select-4-option-2').click()
    cy.get('.css-1s1djjk-control').click()
    cy.get('#react-select-5-option-0').click()
    cy.get('.css-g1d714-ValueContainer > .css-6j8wv5-Input').click()
    cy.get('#react-select-5-option-2').click()
    cy.get('#create_medicine_suggestion_use').type("2 kali")
    cy.get('#create_medicine_quantity').type("2")
    cy.get('.justify-content-center > .btn-primary').click()
  })
})
