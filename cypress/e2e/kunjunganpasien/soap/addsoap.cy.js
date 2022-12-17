describe("login and logout", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Tambah Soap Covid", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1) > svg").click()
    cy.get(".card-toolbar > div > .btn").click()
    cy.get(":nth-child(1) > .form-check > .cursor-pointer").click()
    cy.get(".d-flex > .btn-primary").click()
    cy.get("p > .btn").click()
    cy.get("#Group_8056")
  })
})

describe("Tambah Soap Umum dewasa", () => {
  it("passes", () => {
    cy.get(".card-toolbar > div > .btn").click()
    cy.get(":nth-child(2) > .form-check > .cursor-pointer").click()
    cy.get(".d-flex > .btn-primary").click()
    cy.get("p > .btn").click()
    cy.get("#Group_8056")
  })
})

describe("Tambah Soap Umum Anak", () => {
  it("passes", () => {
    cy.get(".card-toolbar > div > .btn").click()
    cy.get(":nth-child(3) > .form-check > .cursor-pointer").click()
    cy.get(".d-flex > .btn-primary").click()
    cy.get("p > .btn").click()
    cy.get("#Group_8056")
  })
})

describe("Tambah Soap Umum Medis", () => {
  it("passes", () => {
    cy.get(".card-toolbar > div > .btn").click()
    cy.get(":nth-child(4) > .form-check > .cursor-pointer").click()
    cy.get(".d-flex > .btn-primary").click()
    cy.get("p > .btn").click()
    cy.get("#Group_8056")
  })
})
