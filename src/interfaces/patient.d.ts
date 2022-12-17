export interface patient {
  alamat: String,
  asalpasien: String,
  dokter: String,
  jkl: String,
  kode: String,
  kodeasal: String,
  kodejamin: String,
  kodeprovider: String,
  koderuang: String,
  kodespesialis: String,
  kodeunit: String,
  nama: String,
  norm: String,
  norujukan: String,
  nosep: String,
  penjamin: String,
  pulang: String,
  ruang: String,
  spesialisasi: String,
  status: Status,
  tglawal: String,
  tgllahir: String,
  tglrujukan: String,
  tglsep: String,
  umur: String,
  unit: String,
}

export declare type Status = String | "waiting" | "progress" | "done"

