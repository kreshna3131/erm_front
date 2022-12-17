describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Detail pasien perbaikan", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(
      ":nth-child(1) > :nth-child(8) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(".justify-content-start > div > .sc-idiyUo").click()
    cy.get(":nth-child(2) > .dropdown-item").click()
    cy.get(
      '[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary'
    ).click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})

describe("Detail pasien proses", () => {
  it("passes", () => {
    // cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(
      ":nth-child(1) > :nth-child(8) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(".justify-content-start > div > .sc-idiyUo").click()
    cy.get(":nth-child(3) > .dropdown-item").click()
    cy.get(
      '[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary'
    ).click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})

describe("Detail pasien selesai", () => {
  it("passes", () => {
    // cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(
      ":nth-child(1) > :nth-child(8) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(".justify-content-start > div > .sc-idiyUo").click()
    cy.get(":nth-child(3) > .dropdown-item").click()
    cy.get(
      '[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary'
    ).click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})

describe("Detail pasien menunggu", () => {
  it("passes", () => {
    // cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(
      ":nth-child(1) > :nth-child(8) > .d-flex > .btn-light-primary"
    ).click()
    cy.get(".justify-content-start > div > .sc-idiyUo").click()
    cy.get(":nth-child(1) > .dropdown-item").click()
    cy.get(
      '[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary'
    ).click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})
