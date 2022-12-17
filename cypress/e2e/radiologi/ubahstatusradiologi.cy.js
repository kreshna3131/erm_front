describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("ubah status radiologi (perbaikan)", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(":nth-child(1) > :nth-child(8) > .d-flex > div > .sc-idiyUo").click()
    cy.get(":nth-child(2) > .dropdown-item").click()
    cy.wait(3000)
    cy.get(".btn-primary").click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})

describe("ubah status radiologi (proses)", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(":nth-child(1) > :nth-child(8) > .d-flex > div > .sc-idiyUo").click()
    cy.get(":nth-child(3) > .dropdown-item").click()
    cy.wait(3000)
    cy.get(".btn-primary").click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})

describe("ubah status radiologi (selesai)", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(":nth-child(1) > :nth-child(8) > .d-flex > div > .sc-idiyUo").click()
    cy.get(":nth-child(4) > .dropdown-item").click()
    cy.wait(3000)
    cy.get(".btn-primary").click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})

describe("ubah status radiologi (menunggu)", () => {
  it("passes", () => {
    cy.get("#kt_aside_logo").click()
    cy.get('[href="/radiology"] > .menu-icon > svg').click()
    cy.get(":nth-child(1) > :nth-child(8) > .d-flex > div > .sc-idiyUo").click()
    cy.get(":nth-child(1) > .dropdown-item").click()
    cy.wait(3000)
    cy.get(".btn-primary").click()
    cy.wait(5000)
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})
