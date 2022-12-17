import axios from "axios"
import React from "react"
import { Modal } from "react-bootstrap"
import { useQuery } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import { ReactComponent as InfoAddPersonIcon } from "assets/icons/info-add-person.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader from "components/Loader"

export default function ButtonDetailPatient({ patientId: visitId }) {
  const location = useLocation()
  const navigate = useNavigate()
  /**
   * @type {{
   *  data: import("interfaces/patient").patient,
   *  status: "iddle" | "loading" | "success" | "error"
   *  refetch: Function
   * }}
   */
  const {
    data: patientData,
    status: patientStatus,
    refetch: patientRefetch,
  } = useQuery(
    `visit-${visitId}`,
    async () => {
      return axios.get(`/visit/${visitId}/edit`).then((res) => res.data)
    },
    {
      enabled: false,
    }
  )
  return (
    <>
      <ButtonLightStyled
        onClick={() =>
          navigate(location.pathname + `/detail-patient/${visitId}`)
        }
        className="btn btn-icon btn-light-info"
      >
        <InfoAddPersonIcon />
      </ButtonLightStyled>
      {location.pathname.includes("detail-patient") && (
        <Modal
          onShow={() => patientRefetch()}
          show="true"
          animation={false}
          dialogClassName="min-w-md-600px"
        >
          <Modal.Header>
            <Modal.Title as="h3">Identitas Pasien</Modal.Title>
            <GrayCrossIcon
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </Modal.Header>

          <Modal.Body className="p-10">
            {patientStatus === "loading" && (
              <div
                className="d-flex flex-center"
                style={{ minHeight: "140px" }}
              >
                <PrimaryLoader className="min-h-200px"/>
              </div>
            )}
            {patientStatus === "success" && (
              <>
                <div className="overflow-auto h-300px mb-4">
                  <table className="w-100 min-w-300px">
                    <tbody>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Nomor registrasi
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.kode}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Tanggal awal masuk
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.tglawal}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Nomor rekam medis
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.norm}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Nama pasien
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.nama}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Jenis kelamin
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.jkl}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Tanggal lahir
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.tgllahir}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Umur
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.umur}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Alamat
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.alamat}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Unit
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.unit}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Ruang
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.ruang}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Dokter
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.dokter}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Penjamin
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {patientData.penjamin}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Nomor SEP
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {!patientData.nosep ? "-" : patientData.nosep}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Tanggal SEP
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {!patientData.tglsep ? "-" : patientData.tglsep}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Nomor rujukan
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {!patientData.norujukan ? "-" : patientData.norujukan}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                          Tanggal rujukan
                        </th>
                        <td className="w-10px"></td>
                        <td className="w-50 w-md-300px text-gray-600 pb-2">
                          {!patientData.tglrujukan
                            ? "-"
                            : patientData.tglrujukan}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}
