import InputAppendNumber from "./InputAppendNumber"
import InputDate from "./InputDate"
import InputNumber from "./InputNumber"
import InputRadio from "./InputRadio"
import InputRadioPrependNumber from "./InputRadioPrependNumber"
import InputRadioPrependText from "./InputRadioPrependText"
import InputText from "./InputText"
import InputTextArea from "./InputTextArea"
import InputPernahMondok from "./InputPernahMondok"
import InputSkalaNyeri from "./InputSkalaNyeri"
import InputFungsional from "./InputFungsional"
import InputPenurunanBerat from "./InputPenurunanBerat"
import InputAnalisaKeperawatan from "./InputAnalisaKeperawatan"
import InputAppendText from "./InputAppendText"
import InputRiwayatImunisasi from "./InputRiwayatPernahImunisasi"
import InputDropDown from "./InputDropDown"
import InputPernahOperasi from "./InputPernahOperasi"
import InputThoraks from "./InputThoraks"
import InputPermintaanLab from "./InputPermintaanLab"
import InputRencanaTindakLanjut from "./InputRencanaTindakLanjut"
import InputNeurologisKepala from "./InputNeurologisKepala"
import InputNeurologisLeher from "./InputNeurologisLeher"
import InputExtrimitas from "./InputExtrimitas"

export default function ConditionalInput({ item, formik }) {
  const { type } = item

  switch (type) {
    case "text":
      return <InputText formik={formik} item={item} />

    case "number":
      return <InputNumber formik={formik} item={item} />

    case "textarea":
      return <InputTextArea formik={formik} item={item} />

    case "append_number":
      return <InputAppendNumber formik={formik} item={item} />

    case "append_string":
      return <InputAppendText formik={formik} item={item} />

    case "radio":
      return <InputRadio formik={formik} item={item} />

    case "dropdown":
      return <InputDropDown formik={formik} item={item} />

    case "conditional_radio_prepend_string":
      return <InputRadioPrependText formik={formik} item={item} />

    case "conditional_radio_prepend_number":
      return <InputRadioPrependNumber formik={formik} item={item} />

    case "thoraks":
      return <InputThoraks formik={formik} item={item} />

    case "pernah_mondok":
      return <InputPernahMondok formik={formik} item={item} />

    case "operasi_yang_pernah_dialami":
      return <InputPernahOperasi formik={formik} item={item} />

    case "nyeri":
      return <InputSkalaNyeri formik={formik} item={item} />

    case "date":
      return <InputDate formik={formik} item={item} />

    case "fungsional":
      return <InputFungsional formik={formik} item={item} />

    case "nutrisional_dewasa_penurunan_bb":
      return <InputPenurunanBerat formik={formik} />

    case "analisa_keperawatan":
      return <InputAnalisaKeperawatan formik={formik} />

    case "riwayat_imunisasi":
      return <InputRiwayatImunisasi formik={formik} />

    case "laboratorium":
      return <InputPermintaanLab formik={formik} item={item} />

    case "rencana_tindak_lanjut":
      return <InputRencanaTindakLanjut formik={formik} item={item} />

    case "neurologis_kepala":
      return <InputNeurologisKepala formik={formik} item={item} />

    case "neurologis_leher":
      return <InputNeurologisLeher formik={formik} item={item} />

    case "neurologis_extrimitas":
      return <InputExtrimitas formik={formik} item={item} />

    default:
      return <></>
  }
}
