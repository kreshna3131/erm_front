describe("login and logout", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").type("tebar.development@gmail.com")
    cy.get("[name='password']").type("tebar!Dev9")
    cy.get("form").submit()
    cy.get(
      ".cursor-pointer.symbol.symbol-30px.symbol-md-40px.bg-primary"
    ).click()
    cy.get("button").contains("Logout").click()
  })
})