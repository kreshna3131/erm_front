import axios from "axios"
import React from "react"
import { Modal } from "react-bootstrap"
import { useQuery } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import PrimaryLoader from "components/Loader"

/**
 * Komponen utama untuk Detail Author
 */
export default function DetailAuthor() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id: visitId, soapId, documentId, subDocumentId } = useParams()

  const {
    data: userData,
    status: userStatus,
    refetch: userRefetch,
  } = useQuery(
    `visit-${visitId}-soap-${soapId}-assesment-${documentId}-author`,
    async () =>
      axios
        .get(
          `/visit/${visitId}/soap/${soapId}/assesment/${documentId}/sub-dokumen/${subDocumentId}/author`
        )
        .then((res) => res.data),
    { enabled: false }
  )

  const DATASUCCESS = [userStatus].every((item) => item === "success")
  const DATALOADING = [userStatus].includes("loading")
  const DATAERROR = [userStatus].includes("error")

  return (
    <>
      {location.pathname.includes("detail-author") && (
        <Modal onShow={() => userRefetch()} show="true" animation={false}>
          {DATALOADING && (
            <>
              <Modal.Header>
                <Modal.Title as="h3">Loading</Modal.Title>
                <GrayCrossIcon
                  className="cursor-pointer"
                  onClick={() => navigate(-1)}
                />
              </Modal.Header>
              <Modal.Body className="p-10">
                <PrimaryLoader />
              </Modal.Body>
            </>
          )}
          {DATAERROR && (
            <>
              <Modal.Header>
                <Modal.Title as="h3">Error</Modal.Title>
                <GrayCrossIcon
                  className="cursor-pointer"
                  onClick={() => navigate(-1)}
                />
              </Modal.Header>
              <Modal.Body className="p-10">Error...</Modal.Body>
            </>
          )}
          {DATASUCCESS && (
            <>
              <Modal.Header>
                <Modal.Title as="h3">{userData?.name}</Modal.Title>
                <GrayCrossIcon
                  className="cursor-pointer"
                  onClick={() => navigate(-1)}
                />
              </Modal.Header>
              <Modal.Body className="p-10">
                {userStatus === "loading" && <PrimaryLoader />}
                {userStatus === "error" && (
                  <div className="min-h-200px">Error...</div>
                )}
                {userStatus === "success" && (
                  <>
                    <table className="w-100 min-w-300px">
                      <tbody>
                        <tr>
                          <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                            Bisa diisi oleh
                          </th>
                          <td className="w-10px"></td>
                          <td className="w-50 w-md-300px text-gray-600 pb-2">
                            {userData.role}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                            Dibuat oleh
                          </th>
                          <td className="w-10px"></td>
                          <td className="w-50 w-md-300px text-gray-600 pb-2">
                            {userData.created_by}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                            Terakhir diubah
                          </th>
                          <td className="w-10px"></td>
                          <td className="w-50 w-md-300px text-gray-600 pb-2">
                            {userData.updated_at}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-40 w-md-200px text-end fw-bold text-gray-700 pb-2">
                            Diubah oleh
                          </th>
                          <td className="w-10px"></td>
                          <td className="w-50 w-md-300px text-gray-600 pb-2">
                            {userData.updated_by}
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
                  </>
                )}
              </Modal.Body>
            </>
          )}
        </Modal>
      )}
    </>
  )
}
