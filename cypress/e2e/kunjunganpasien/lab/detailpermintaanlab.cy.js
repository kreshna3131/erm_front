describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("detail permintaan lab", () => {
  it("passes", () => {
    cy.get(".sc-idiyUo > :nth-child(1)").click()
    cy.get(".px-10 > .d-flex > :nth-child(2)").click()
    cy.get(
      ":nth-child(1) > :nth-child(7) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(":nth-child(3) > .d-flex > .form-control").clear().type("1").click()
    cy.get(":nth-child(3) > .d-flex > .sc-dkzDqf").click()
    cy.get(".align-items-center > .sc-dkzDqf").click()
  })
})

describe("Komentar pada permintaan detail lab", () => {
  it("passes", () => {
    cy.get(
      ":nth-child(1) > :nth-child(7) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(".mb-4 > .form-control").type(
      "Test komentar permintaan detail lab cypress"
    )
    cy.get("form > .d-flex > .sc-dkzDqf").click()
    cy.get(".mb-4 > .form-control").type(
      "Test komentar permintaan detail lab cypress"
    )
    cy.get("form > .d-flex > .btn-primary").click()
  })
})

describe("Cek identitas pasien", () => {
  it("passes", () => {
    cy.get(".btn-light-info").click()
    cy.wait(5000)
    cy.get(".p-10 > .d-flex > .btn").click()
  })
})

describe("Ubah status permintaan detail lab", () => {
  it("passes", () => {
    cy.get(".justify-content-start > div > .sc-dkzDqf").click()
    // cy.get(".fade > :nth-child(2) > .d-flex").click()
    cy.get(".sc-papXJ > :nth-child(2)").click()
    cy.get(
      '[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary'
    ).click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
    cy.get("#Group_8101").click()
  })
})
