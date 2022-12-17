describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Detail E Resep Racikan", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1)").click()
    cy.get(".px-10 > .d-flex > :nth-child(4)").click()
    cy.get(
      ":nth-child(2) > :nth-child(7) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(".card-toolbar > .d-flex > .btn").click()
    cy.get("#create_name").type("Test Tambah racikan")
    cy.get("#create_total").type("2")
    cy.get(".css-1hj0isz-control > .css-319lph-ValueContainer").click()
    cy.get("#react-select-4-option-0").click()
    cy.get(".css-6j8wv5-Input").click()
    cy.get("#react-select-4-option-2").click()
    cy.get("#create_suggestion_use").type("Rutin Yaaa")
    cy.get(".row.justify-content-center > .d-flex > .btn-primary").click()
  })
})
