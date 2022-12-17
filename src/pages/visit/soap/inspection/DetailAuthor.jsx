import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import { Modal } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router"
import { AssessmentTypeLabel } from "./Index"
import { DateTime } from "luxon"

/**
 * Komponen utama untuk Detail Author
 * @param {{
 * inspectionData: Object
 * }}
 */
export default function DetailAuthor({ inspectionData }) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      {location.pathname.includes("detail-author") && (
        <Modal show="true" animation={false}>
          <Modal.Header>
            <div className="d-flex align-items-center">
              <Modal.Title className="me-3" as="h3">
                Info
              </Modal.Title>
              <span class="badge px-4 py-2 bg-light-info text-info me-3 my-1">
                {DateTime.now().toFormat("dd/MM/yyyy") +
                  " jam " +
                  DateTime.now().toFormat("hh.mm")}
              </span>
              <div className="mb-n1">
                <AssessmentTypeLabel type={inspectionData.assesment_name} />
              </div>
            </div>
            <GrayCrossIcon
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </Modal.Header>
          <Modal.Body className="p-10">
            <table className="w-100 min-w-300px">
              <tbody>
                <tr>
                  <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                    Dibuat oleh
                  </th>
                  <td className="w-10px"></td>
                  <td className="w-50 w-md-300px text-gray-600 pb-2">
                    {inspectionData.created_by}
                  </td>
                </tr>
                <tr>
                  <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                    Sebagai
                  </th>
                  <td className="w-10px"></td>
                  <td className="w-50 w-md-300px text-gray-600 pb-2">
                    {inspectionData.created_role}
                  </td>
                </tr>
                <tr>
                  <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                    Terakhir diubah
                  </th>
                  <td className="w-10px"></td>
                  <td className="w-50 w-md-300px text-gray-600 pb-2">
                    {inspectionData.updated_at}
                  </td>
                </tr>
                <tr>
                  <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                    Diubah oleh
                  </th>
                  <td className="w-10px"></td>
                  <td className="w-50 w-md-300px text-gray-600 pb-2">
                    {inspectionData.created_by}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-center mt-5">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}
