describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("setting covid", () => {
  it("passes", () => {
    cy.get(".cursor-pointer > .d-flex").click()
    cy.get(".menu > :nth-child(3) > .menu-link").trigger("mouseover")
    cy.get(".card-body > :nth-child(1) > .menu-link").click()
    cy.wait(5000)
    cy.get("tbody > :nth-child(1) > :nth-child(1)").click()
    cy.get(":nth-child(1) > :nth-child(4) > .d-flex > .sc-idiyUo").click()
    cy.wait(7000)
    cy.get(":nth-child(1) > :nth-child(4) > .d-flex > .sc-idiyUo").click()
    cy.wait(7000)
    cy.get(":nth-child(1) > :nth-child(5) > .sc-idiyUo").click()
    cy.wait(5000)
    cy.get(
      ":nth-child(1) > .card > .card-body > .justify-content-between > :nth-child(2) > .me-3 > .react-switch-bg"
    ).click()
    cy.wait(5000)
    cy.get(
      ":nth-child(1) > .card > .card-body > .justify-content-between > :nth-child(2) > .me-3 > .react-switch-bg"
    ).click()
    cy.get(
      ":nth-child(1) > .card > .card-body > .justify-content-between > :nth-child(2) > .sc-idiyUo"
    ).click()
    cy.wait(5000)
    cy.get(".mt-2 > .react-switch-bg").click()
    cy.wait(5000)
    cy.get(".mt-2 > .react-switch-bg").click()
    cy.get(".btn-primary").click()
    cy.get("p > .btn").click()
    cy.get(".flex-column > .sc-idiyUo").click()
  })
})
