import { ReactComponent as GrayPencilIcon } from "assets/icons/gray-pencil-2.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryPasteIcon } from "assets/icons/primary-paste.svg"
import { ReactComponent as PurpleExclamationIcon } from "assets/icons/purple-exclamation.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import ConditionalInput from "components/FormBuiler/ConditionalInput"
import { useFormik } from "formik"
import { createValidationScheme } from "helpers/formik-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import _ from "lodash"
import { useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import styled from "styled-components"
import DetailPatient from "../../ButtonDetailPatient"
import DetailAuthor from "./DetailAuthor"
import { DonwnlodPDFButton } from "./Index"
import PrimaryLoader from "components/Loader"

/**
 * Styling accordion
 */
export const AccordionWhite = styled.div`
  .accordion-item {
    border-radius: 10px;
    border: none;
    box-shadow: 0px 0px 20px 0px rgba(76, 87, 125, 0.02);
    -webkit-box-shadow: 0px 0px 20px 0px rgba(76, 87, 125, 0.02);
    -moz-box-shadow: 0px 0px 20px 0px rgba(76, 87, 125, 0.02);
  }

  .accordion-button {
    border-radius: 10px !important;
    background-color: white;
    border-bottom: none;

    &:not(.collapsed) {
      box-shadow: none !important;

      svg {
        path:not(.exception),
        rect:not(.exception),
        circle:not(.exception) {
          fill: #f79d25;
          transition: all 0.3s;
        }
      }

      &::after {
        background-image: url("data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23F79D25%27><path fill-rule=%27evenodd%27 d=%27M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z%27/></svg>");
      }
    }
  }

  .accordion-body {
    border-top: 1px solid #f3f6f9;
  }
`
/**
 * Styling floating button action
 */
export const FloatingActionButton = styled.div`
  position: fixed;
  height: 86px;
  width: 46px;
  top: 200px;
  right: 0;
  background: #ffffff;
  z-index: 10;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 0px 50px 0px rgba(79, 66, 180, 0.15);

  .btn-icon {
    height: 34px;
    width: 34px;
  }
`
/**
 * Check apakah group form builder ada error
 * @param {Object} formik
 * @param {Array} attributeData
 * @returns {Boolean}
 */
function groupHasError(formik, attributeGroup) {
  return (
    attributeGroup.filter(
      (item) =>
        Object.keys(formik.errors).includes(item.name) ||
        Object.keys(formik.errors).includes(item.name + "_text") ||
        Object.keys(formik.errors).includes(item.name + "_pilihan") ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("fungsional")
        ) &&
          item.name.includes("fungsional")) ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("nutrisional_dewasa_penurunan_bb")
        ) &&
          item.name.includes("nutrisional_dewasa_penurunan_bb")) ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("operasi_yang_pernah_dialami")
        ) &&
          item.name.includes("operasi_yang_pernah_dialami")) ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("rencana_tindak_lanjut")
        ) &&
          item.name.includes("rencana_tindak_lanjut")) ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("neurologis_kepala")
        ) &&
          item.name.includes("neurologis_kepala")) ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("neurologis_leher")
        ) &&
          item.name.includes("neurologis_leher")) ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("extrimitas")
        ) &&
          item.name.includes("extrimitas")) ||
        (Object.keys(formik.errors).some((error) =>
          error.includes("analisa_keperawatan")
        ) &&
          item.name.includes("analisa_keperawatan")) ||
        (Object.keys(formik.errors).some((error) => error.includes("simo")) &&
          item.name.includes("pernah_mondok"))
    ).length && formik.submitCount
  )
}

/**
 * Komponen utama untuk halaman Edit assesment
 */
export default function Edit() {
  const { id: visitId, soapId, documentId, subDocumentId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [initialValues, setInitialValues] = useState(null)
  const [validationSchema, setValidationSchema] = useState(null)
  const [submitStatus, setSubmitStatus] = useState()
  const { allPermissions } = useOutletContext()

  /**
   * Mengambil data attribute untuk form builder
   */
  const { data: attributeData, status: attributeStatus } = useQuery(
    `visit-${visitId}-soap-${soapId}-document-${documentId}-sub-dokumen-${subDocumentId}-attribute`,
    async (key) =>
      axios
        .get(
          `visit/${visitId}/soap/${soapId}/assesment/${documentId}/sub-dokumen/${subDocumentId}/attribute`
        )
        .then(async (res) => {
          return res.data
        }),
    {
      refetchOnWindowFocus: false,
    }
  )

  /**
   * Mengupdate ulang skema validasi form builder
   */
  useEffect(() => {
    if (attributeData) {
      createValidationScheme(attributeData).then((data) => {
        setValidationSchema(data)
      })
    }
  }, [attributeData])

  /**
   * Mengambil data pasien
   */
  const patientQuery = useQuery(
    `visit-${visitId}`,
    async () => {
      return axios.get(`/visit/${visitId}/edit`).then((res) => res.data)
    },
    {
      enabled: false,
      /** @param {import("interfaces/patient").patient} data */
      onSuccess: function (data) {
        setInitialValues({ ...initialValues, poliklinik: data.ruang })
      },
    }
  )

  /**
   * Mengambil data detail attribute sub dokumen
   */
  const { data: subDocumentData, status: subDocumentStatus } = useQuery(
    `visit-${visitId}-soap-${soapId}-document-${documentId}-sub-dokumen-${subDocumentId}-edit`,
    async (key) =>
      axios
        .get(
          `visit/${visitId}/soap/${soapId}/assesment/${documentId}/sub-dokumen/${subDocumentId}/edit`
        )
        .then((res) => {
          return res.data
        }),
    {
      onSuccess: function () {
        patientQuery.refetch()
      },
      refetchOnWindowFocus: false,
    }
  )

  /**
   * Mengambil data detail sub dokumen
   */
  const subDocumentQuery = useQuery(
    `visit-${visitId}-soap-${soapId}-document-${documentId}-sub-dokumen-${subDocumentId}-edit-sub-dokumen`,
    async () =>
      axios
        .get(
          `visit/${visitId}/soap/${soapId}/assesment/${documentId}/sub-dokumen/${subDocumentId}/edit-sub-dokumen`
        )
        .then((res) => res.data)
  )

  /**
   * Mengupdate ulang nilai awal form builder
   */
  useEffect(() => {
    if (subDocumentData) {
      setInitialValues(
        // change every null value to empty string
        _.mapValues(subDocumentData, (v) => (v === null ? "" : v))
      )
    }
  }, [subDocumentData])

  /**
   * Menyimpan data sub-dokumen
   */
  const { mutate } = useMutation(async (data) =>
    axios
      .post(
        `visit/${visitId}/soap/${soapId}/assesment/${documentId}/sub-dokumen/${subDocumentId}/update`,
        data
      )
      .then((res) => res.data)
  )

  /**
   * Konfigurasi formik form builder
   */
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(
        {
          ...values,
          _method: "PATCH",
        },
        {
          onSuccess: async function () {
            await queryClient.invalidateQueries(`visit-${visitId}-soap`)
            await queryClient.invalidateQueries(
              `visit-${visitId}-soap-${soapId}-edit`
            )
            await queryClient.invalidateQueries(
              `visit-${visitId}-soap-${soapId}-document-${documentId}-sub-dokumen-${subDocumentId}-edit`
            )
            setSubmitting(false)
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data.",
            })
          },
          onError: function (err) {
            switch (err.response.status) {
              case 422:
                formik.setErrors(err.response.data.errors)
                break

              default:
                setSubmitStatus({
                  status: "danger",
                  message:
                    "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
                })
                break
            }

            setSubmitting(false)
          },
        }
      )
    },
  })

  /**
   * Kondisi saat semua data form siap
   */
  const FORMREADY =
    [attributeStatus, subDocumentStatus, patientQuery.status].every(
      (item) => item === "success"
    ) &&
    [initialValues, validationSchema, formik.values].every(
      (item) => item !== null
    )

  /**
   * Kondisi saat semua data form belum siap (loading)
   */
  const FORMLOADING =
    [attributeStatus, subDocumentStatus, patientQuery.status].includes(
      "loading"
    ) || [initialValues, validationSchema, formik.values].includes(null)

  /**
   * Kondisi saat semua data form terjadi error
   */
  const FORMERROR = [
    attributeStatus,
    subDocumentStatus,
    patientQuery.status,
  ].includes("error")

  return (
    <div>
      {submitStatus?.status && (
        <SweetAlert
          title=""
          type={submitStatus.status}
          style={{
            minHeight: "322px",
            width: "364px",
            padding: "30px",
            borderRadius: "10px",
          }}
          onConfirm={() => {
            if (submitStatus.status === "success") {
              navigate(`/visit/${visitId}/soap`)
            } else {
              setSubmitStatus({})
            }
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      {FORMREADY && (
        <FloatingActionButton>
          <ButtonLightStyled
            onClick={() => formik.submitForm()}
            className="btn btn-icon btn-light-primary"
            disabled={formik.isSubmitting}
          >
            <PrimaryPasteIcon />
          </ButtonLightStyled>
          <ButtonLightStyled
            onClick={() =>
              navigate(
                location.pathname + "/detail-author/" + subDocumentData.user_id
              )
            }
            className="btn btn-icon btn-light-purple"
          >
            <PurpleExclamationIcon />
          </ButtonLightStyled>
          <DetailAuthor />
        </FloatingActionButton>
      )}
      <Toolbar subDocumentQuery={subDocumentQuery} />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          {FORMLOADING && (
            <div className="d-flex flex-center min-h-400px">
              <PrimaryLoader />
            </div>
          )}
          {FORMERROR && (
            <div className="d-flex flex-center min-h-400px">
              <div className="text-gray-600">Error ...</div>
            </div>
          )}
          {FORMREADY && (
            <>
              <AccordionWhite>
                <Accordion className="mb-5" defaultActiveKey="0">
                  {Object.keys(attributeData).map((group, key) => {
                    return (
                      <Accordion.Item
                        key={key}
                        className="bg-white mb-5"
                        eventKey={!key ? "0" : key}
                      >
                        <Accordion.Header>
                          <div className="d-flex align-items-center">
                            <GrayPencilIcon className="me-3" />
                            <h5 className="text-gray-700 m-0">{group}</h5>
                          </div>
                          <p
                            className="position-absolute text-danger mb-0"
                            style={{ right: "70px" }}
                          >
                            {groupHasError(formik, attributeData[group])
                              ? "Ada kolom yang belum diisi di group ini"
                              : ""}
                          </p>
                        </Accordion.Header>
                        <Accordion.Body>
                          <form onSubmit={formik.handleSubmit}>
                            <div className="row justify-content-center">
                              <div className="col">
                                {attributeData[group].map((attribute, key) => {
                                  return (
                                    <ConditionalInput
                                      key={key}
                                      item={attribute}
                                      formik={formik}
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          </form>
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })}
                </Accordion>
              </AccordionWhite>
            </>
          )}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={() => formik.submitForm()}
              className="btn btn-primary mb-5"
              disabled={formik.isSubmitting}
            >
              {!formik.isSubmitting && (
                <span className="indicator-label fw-medium">Simpan</span>
              )}
              {formik.isSubmitting && (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Komponen toolbar edit sub-dokumen
 */
function Toolbar({ subDocumentQuery }) {
  const navigate = useNavigate()
  const { id: visitId, soapId, documentId, subDocumentId } = useParams()
  const downloadUrl = `visit/${visitId}/soap/${soapId}/assesment/${documentId}/sub-dokumen/${subDocumentId}/printPdf`
  const [breadCrumbJson, setBreadCrumbJson] = useState({
    title: "Pelayanan",
    items: [
      { text: "Kunjungan", path: "/visit" },
      {
        text: "Pelayanan",
        path: `/visit/${visitId}/soap`,
      },
      {
        text: "SOAP",
        path: `/visit/${visitId}/soap/${soapId}`,
      },
      {
        text: "Edit",
        path: `/visit/${visitId}/soap/${soapId}/document/${documentId}`,
      },
      {
        text: "Edit",
        path: null,
      },
    ],
  })

  const subDocumentData = subDocumentQuery.data
  const subDocumentStatus = subDocumentQuery.status

  useEffect(() => {
    if (subDocumentData) {
      setBreadCrumbJson({
        title: "Pelayanan",
        items: [
          { text: "Kunjungan", path: "/visit" },
          {
            text: "Pelayanan",
            path: `/visit/${visitId}/soap`,
          },
          {
            text: "SOAP",
            path: `/visit/${visitId}/soap/${soapId}`,
          },
          {
            text: `Assesment ${subDocumentData.type}`,
            path: `/visit/${visitId}/soap/${soapId}/document/${documentId}`,
          },
          {
            text: subDocumentData.name,
            path: null,
          },
        ],
      })
    }
  }, [subDocumentData])

  useBreadcrumb(breadCrumbJson)

  return (
    <>
      <div className="toolbar mt-n2 mt-md-n3 mt-lg-0" id="kt_toolbar">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-sm-9 d-flex align-items-center mb-5 mb-sm-0">
              <ButtonLightStyled
                onClick={() => navigate(-1)}
                className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
              >
                <PrimaryArrowLeftIcon />
              </ButtonLightStyled>
              {subDocumentStatus === "success" && (
                <div className="overflow-hidden">
                  <h1 className="fs-3 mb-0 me-4 text-truncate">
                    {subDocumentData.name}
                  </h1>
                </div>
              )}
            </div>
            <div className="col-sm-3 d-flex justify-content-start justify-content-sm-end">
              {subDocumentStatus === "success" && (
                <DonwnlodPDFButton
                  type={subDocumentData.type}
                  url={downloadUrl}
                />
              )}
              <DetailPatient />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
