const { clear } = require("@testing-library/user-event/dist/clear")

describe("login", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000")
    cy.get("[name='email']").clear().type("tebar.development@gmail.com")
    cy.get("[name='password']").clear().type("tebar!Dev9")
    cy.get("form").submit()
  })
})

describe("Detail pasien", () => {
  it("passes", () => {
    cy.wait(4000)
    cy.get(".sc-idiyUo > :nth-child(1) > svg").click()
    cy.get("tbody > :nth-child(1) > :nth-child(7)").click()
    cy.wait(3000)
    cy.get(".sc-idiyUo > .sc-idiyUo").click()
    cy.wait(2000)
    cy.get(".justify-content-end > .btn").click()
  })
})

describe("Isi informasi dasar", () => {
  it("passes", () => {
    cy.wait(4000)
    cy.get(":nth-child(1) > .accordion-collapse > .accordion-body").click()
    cy.get("#riwayat_alergi0").click()
    // cy.get(".d-flex > :nth-child(2) > .form-check").click()
    cy.wait(2000)
    // cy.get('input[type="radio"]').check("0")
  })
})

describe("Isi Anamnesis", () => {
  it("passes", () => {
    cy.wait(4000)
    cy.get(":nth-child(2) > .accordion-header > .accordion-button").click()
    cy.get("#keluhan").clear().type("Ini tes keluhan")
    cy.get("#riwayat_penyakit_sekarang")
      .clear()
      .type("Tes Riwayat penyakit sekarang")
    cy.get("#riwayat_penyakit_dahulu")
      .clear()
      .type("Test riwayat penyakit dulu")
    cy.get("#riwayat_penyakit_keluarga")
      .clear()
      .type("test riwayat penyakit keluarga")
  })
})

describe("Isi Pemeriksaan Fisik", () => {
  it("passes", () => {
    cy.get(":nth-child(3) > .accordion-header > .accordion-button").click()
    cy.get("#tekanan_darah").clear().type("100")
    cy.get("#frekuensi_nadi").clear().type("60")
    cy.get("#frekuensi_napas").clear().type("30")
    cy.get("#keadaan_umum").clear().type("keadaan umum")
    cy.get("#berat_badan").clear().type("70")
    cy.get("#tinggi_badan").clear().type("170")
    cy.get("#tindakan_resusitasi").clear().type("test tindakan resusitasi")
    cy.get("#gds").clear().type("70")
    cy.get("#kepala").clear().type("test kepala")
    cy.get("#mata").clear().type("test mata")
    cy.get("#mulut").clear().type("test mulut")
    cy.get("#leher").clear().type("test leher")
    cy.get("#thoraks_cor").clear().type("test thoraks cor")
    cy.get("#thoraks_pulmo").clear().type("test thoraks pulmo")
    cy.get("#abdomen").clear().type("test abdomen")
    cy.get("#extremitas").clear().type("test extremitas")
    cy.get("#anus_genitalia").clear().type("test anus")
    cy.get("#lain_lain").clear().type("test lain")
  })
})

describe("Pemeriksaan Penunjang", () => {
  it("passes", () => {
    cy.get(":nth-child(4) > .accordion-header > .accordion-button").click()
    cy.get(".css-319lph-ValueContainer").click()
    cy.get("#react-select-6-option-0").click()
    cy.get("#ekg").clear().type("test ekg")
    cy.get("#xray").clear().type("test xray")
    cy.get("#diagnosis_kerja").clear().type("test diagnosis kerja")
    cy.get("#diagnosis_banding").clear().type("test diagnosis banding")
    cy.get("#rencana_terapi").clear().type("test rencana terapi")
    cy.get("#rencana_tindak_lanjut_rawat_inap").click()
    cy.get("#ruang").clear().type("test ruang")
    cy.get("#indikasi").clear().type("test indikasi")
    cy.get("#dpjp").clear().type("test dpjp")
    cy.get("#edukasi_pasien").clear().type("test edukasi pasien")
    cy.get(".justify-content-end > .btn").click()
    cy.get("p > .btn").click()
    cy.get(".align-items-center > .sc-idiyUo").click()
  })
})

describe("Ubah status assesmen umum medis di SOAP", () => {
  it("passes", () => {
    cy.wait(3000)
    cy.get(".position-relative > div > .sc-idiyUo").click()
    cy.get(".fade > :nth-child(2) > .d-flex").click()
    cy.get(
      '[style="display: flex; z-index: 1; flex-wrap: wrap; align-items: center; justify-content: center; width: 100%; margin: 1.25em auto 0px;"] > .btn-primary'
    ).click()
    cy.get(
      ':nth-child(2) > [style="background-color: rgba(0, 0, 0, 0.4); position: fixed; inset: 0px; z-index: 5400; display: flex; flex-direction: row; align-items: center; justify-content: center; padding: 0.625em; overflow: hidden auto;"] > .sweet-alert > p > .btn'
    ).click()
  })
})

describe("passes", () => {
  it("passes", () => {
    cy.get(".btn-light-info").click()
    cy.wait(5000)
    cy.get(".p-10 > .d-flex > .btn").click()
  })
})
