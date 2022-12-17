import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import "@pnotify/confirm/dist/PNotifyConfirm.css"
import "@pnotify/core/dist/BrightTheme.css"
import "@pnotify/core/dist/PNotify.css"
import "assets/css/custom-ckeeditor.css"
import "assets/css/custom-pnotify.css"
import { error, success } from "@pnotify/core"
import { ReactComponent as DangerTrashIcon } from "assets/icons/danger-trash.svg"
import { ReactComponent as GrayCrossIcon } from "assets/icons/gray-cross.svg"
import { ReactComponent as InfoQuestionIcon } from "assets/icons/info-question.svg"
import { ReactComponent as PrimaryArrowLeftIcon } from "assets/icons/primary-arrow-left.svg"
import { ReactComponent as PrimaryAttchIcon } from "assets/icons/primary-attch.svg"
import { ReactComponent as PrimaryFolderIcon } from "assets/icons/primary-folder.svg"
import { ReactComponent as WarningPreviewIcon } from "assets/icons/warning-preview.svg"
import { ReactComponent as WhitePasteIcon } from "assets/icons/white-paste.svg"
import { ReactComponent as WhiteUploadIcon } from "assets/icons/white-upload.svg"
import axios from "axios"
import clsx from "clsx"
import { ButtonLightStyled, FormikSubmitButton } from "components/Button"
import DeleteModal from "components/table/DeleteModal"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import ButtonDetailPatient from "pages/lab/result/ButtonDetailPatient"
import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import { useSearchParams } from "react-router-dom"
import styled from "styled-components"
import * as Yup from "yup"

/**
 * jumlah maksimum lampiran yang dapat di upload
 */
const maxItemUploadFile = 10

/**
 * Konfigurasi kustom toolbar ckeeditor
 */
const toolbarConfig = [
  "heading",
  "|",
  "bold",
  "italic",
  "link",
  "numberedList",
  "bulletedList",
  "|",
  "outdent",
  "indent",
  "|",
  "undo",
  "redo",
]

/**
 * Data inisial json breadcrumb
 */
const initialBreadCrumbJson = {
  title: "Radiology",
  items: [
    { text: "Radiology", path: "/radiology" },
    { text: "Detail", path: "/radiology" },
    { text: "Tindakan", path: null },
  ],
}

/**
 * Kustom komponen list lampiran
 */
const AttchList = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eff2f5;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;

  &:first-child {
    border-top: 1px solid #eff2f5;
  }
`
/**
 * Kustom komponen preview lampiran
 */
const PreviewAttch = styled.div`
  max-height: 283px;
  overflow-y: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 30px;
`
/**
 * Kustom komponen preview lampiran scroll
 */
const PreviewAttchScroll = styled.div`
  overflow-y: scroll;
  max-height: 283px;
`

/**
 * Komponen utama edit aksi radiologi
 */
export default function Edit() {
  const location = useLocation()
  const { requestId, actionId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({
    status: "",
    message: "",
  })
  const [breadCrumbJson, setBreadCrumbJson] = useState(initialBreadCrumbJson)
  const [initialValuesUpdated, setInitialValuesUpdated] = useState(false)
  const [initialValues, setInitialValues] = useState({
    status: "",
    result: "",
  })
  useBreadcrumb(breadCrumbJson)

  const actionQuery = useQuery(
    `radiology-request-${requestId}-action-${actionId}`,
    async () =>
      axios
        .get(`/visit/radiology/${requestId}/measure/${actionId}/edit`)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        setInitialValues({
          status: data.status,
          result: data.result ?? "",
        })
        setInitialValuesUpdated(true)
      },
    }
  )

  useEffect(() => {
    setBreadCrumbJson({
      title: "Radiology",
      items: [
        { text: "Radiology", path: "/radiology" },
        { text: "Detail", path: `radiology/request/${requestId}` },
        { text: "Tindakan", path: null },
      ],
    })
  }, [requestId])

  const { mutate } = useMutation(async (data) =>
    axios
      .post(
        `/visit/radiology/${requestId}/measure/${actionId}/update-result`,
        data
      )
      .then((res) => res.data)
  )

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      status: Yup.string().required("Kolom ini wajib untuk diisi"),
      result: Yup.string().required("Kolom ini wajib untuk diisi"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(
        {
          ...values,
          _method: "PATCH",
        },
        {
          onSuccess: () => {
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data.",
            })
            setSubmitting(false)
          },
          onError: (err) => {
            switch (err.response.status) {
              case 422:
                const errors = err.response.data.errors
                formik.setErrors({
                  ...formik.errors,
                  ...errors,
                })
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

  return (
    <>
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
            setSubmitStatus({})
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <Toolbar actionQuery={actionQuery} />
      <div className="post d-flex flex-column-fluid pt-5 pt-lg-15" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              {formik.errors.result && formik.touched.result && (
                <p className="alert bg-light-danger text-danger">
                  Hasil tindakan wajib untuk diisi.
                </p>
              )}
              {!initialValuesUpdated && (
                <div className="card">
                  <div className="card-body d-flex flex-center min-h-400px"></div>
                </div>
              )}
              {initialValuesUpdated && (
                <div className="card">
                  <div className="card-body min-h-400px p-1">
                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        toolbar: toolbarConfig,
                      }}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "400px",
                            editor.editing.view.document.getRoot()
                          )
                        })
                        editor.setData(formik.values.result)
                      }}
                      onChange={(event, editor) => {
                        formik.setFieldValue("result", editor.getData())
                      }}
                      onBlur={() => formik.setFieldTouched("result")}
                    />
                  </div>
                </div>
              )}
              <div className="card my-4">
                <div className="card-body d-flex flex-center">
                  <div className="form-group w-100">
                    <div className="row">
                      <div className="col-sm-4 d-flex justify-content-sm-end">
                        <label className="form-label fs-6 fw-medium text-gray-700 ">
                          Status tindakan
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div>
                          <div className="form-check form-check-solid form-check-inline me-10">
                            <input
                              className="form-check-input"
                              type="radio"
                              value="unfinish"
                              id="unfinish-radio"
                              checked={formik.values.status === "unfinish"}
                              onChange={() =>
                                formik.setFieldValue("status", "unfinish")
                              }
                            />
                            <label
                              className="form-check-label text-gray-600"
                              htmlFor="unfinish-radio"
                            >
                              Belum selesai
                            </label>
                          </div>
                          <div className="form-check form-check-solid form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="finish-radio"
                              value="finish"
                              checked={formik.values.status === "finish"}
                              onChange={() =>
                                formik.setFieldValue("status", "finish")
                              }
                            />
                            <label
                              className="form-check-label text-gray-600"
                              htmlFor="finish-radio"
                            >
                              Sudah selesai
                            </label>
                          </div>
                        </div>
                        {formik.touched.status && formik.errors.status && (
                          <span className="invalid-feedback" type="invalid">
                            {formik.errors.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mb-4">
                <button
                  onClick={() => formik.submitForm()}
                  className="btn btn-primary"
                  disabled={formik.isSubmitting}
                >
                  {!formik.isSubmitting && (
                    <>
                      <WhitePasteIcon className="me-2" />
                      Simpan
                    </>
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
            <div className="col-md-4">
              <Attachment />
            </div>
          </div>
        </div>
      </div>
      {location.pathname.includes("upload") && <UploaAttchModal />}
    </>
  )
}

/**
 * Komponen yang berisi list lampiran
 */
function Attachment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { requestId, actionId, attachmentId } = useParams()
  const attchQuery = useQuery(
    `visit-radiology-${requestId}-measure-${actionId}-listing-attachment`,
    async () =>
      axios
        .get(
          `/visit/radiology/${requestId}/measure/${actionId}/listing-attachment`
        )
        .then((res) => res.data)
  )

  const attchData = attchQuery.data
  const attchStatus = attchQuery.status

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center mx-5 p-2 border-0">
          <div className="d-flex align-items-center">
            <PrimaryAttchIcon className="me-4" />
            <h3 className="m-0">Lampiran</h3>
          </div>
          <div className="rounded d-flex flex-center h-30px w-30px bg-light-primary">
            <div className="text-primary fw-bold">{attchData?.total ?? 0}</div>
          </div>
        </div>
        <div className="card-body px-5 py-0">
          {attchStatus === "loading" && (
            <div className="d-flex flex-center flex-column min-h-300px">
              <span className="w-200px text-center text-gray-600">
                Loading...
              </span>
            </div>
          )}
          {attchStatus === "error" && (
            <div className="d-flex flex-center flex-column min-h-300px">
              <span className="w-200px text-center text-gray-600">
                Error...
              </span>
            </div>
          )}
          {attchStatus === "success" && (
            <>
              {attchData.data.length === 0 ? (
                <div className="d-flex flex-center flex-column min-h-300px">
                  <PrimaryFolderIcon className="mb-4" />
                  <span className="w-200px text-center text-gray-600">
                    Belum ada lampiran yang diupload pada tindakan ini
                  </span>
                </div>
              ) : (
                <div className="d-flex flex-column min-h-300px">
                  {attchData.data.map(
                    /** @param {import("interfaces/attachment").RadiologyAttch} attch */
                    (attch, key) => (
                      <AttchList key={key}>
                        <div className="d-flex justify-content-center flex-column">
                          <p className="text-gray-700 fw-semi-bold mb-2">
                            {attch.photo_name}
                          </p>
                          <p className="text-gray-600 m-0">
                            {attch.updated_at}
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <ButtonLightStyled
                            onClick={() =>
                              navigate(`attachment/${attch.id}/edit`)
                            }
                            className="btn btn-icon btn-light-warning me-3"
                          >
                            <WarningPreviewIcon />
                          </ButtonLightStyled>
                          <ButtonLightStyled
                            onClick={() =>
                              navigate(
                                `attachment/${attch.id}/delete?name=${attch.photo_name}`
                              )
                            }
                            className="btn btn-icon btn-light-danger"
                          >
                            <DangerTrashIcon />
                          </ButtonLightStyled>
                        </div>
                      </AttchList>
                    )
                  )}
                </div>
              )}
            </>
          )}
          <div className="d-flex flex-center py-10">
            <ButtonLightStyled
              onClick={() => navigate("help")}
              className="btn btn-icon btn-light-info me-3"
            >
              <InfoQuestionIcon />
            </ButtonLightStyled>
            <button
              onClick={() => navigate("upload")}
              className="btn btn-primary"
              disabled={attchData?.total >= maxItemUploadFile}
            >
              <WhiteUploadIcon className="me-2" />
              <span>Upload Lampiran</span>
            </button>
          </div>
        </div>
      </div>
      {location.pathname.includes(`action/${actionId}/edit/help`) && (
        <HelpAttchModal />
      )}
      {location.pathname.includes(`attachment/${attachmentId}/edit`) && (
        <DetailAttchModal />
      )}
      {location.pathname.includes(`attachment/${attachmentId}/delete`) && (
        <DeleteModal
          url={`/visit/radiology/measure/${actionId}/attachment/${attachmentId}/delete-attachment`}
          query={`visit-radiology-${requestId}-measure-${actionId}-listing-attachment`}
          message={`Anda yakin ingin menghapus ${searchParams.get("name")}?`}
          successMessage={`Anda telah menghapus ${searchParams.get(
            "name"
          )} dari basis data!`}
        />
      )}
    </>
  )
}

/**
 * Komponen modal untuk edit lampiran
 */
function DetailAttchModal() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { requestId, actionId, attachmentId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({
    status: "",
    message: "",
  })
  const [initialValues, setInitialValues] = useState({
    photo_name: "",
    photo_path: "",
  })
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      photo_name: Yup.string().required("Kolom ini wajib untuk diisi"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(
        {
          ...values,
          _method: "PATCH",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(
              `visit-radiology-${requestId}-measure-${actionId}-listing-attachment`
            )
            setSubmitting(false)
            setSubmitStatus({
              status: "success",
              message: "Data telah berhasil disimpan ke dalam basis data.",
            })
          },
          onError: (err) => {
            setSubmitting(false)
            switch (err.response.status) {
              case 422:
                const errors = err.response.data.errors
                formik.setErrors({
                  ...formik.errors,
                  ...errors,
                })
                break

              default:
                setSubmitStatus({
                  status: "danger",
                  message:
                    "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
                })
                break
            }
          },
        }
      )
    },
  })
  const { mutate } = useMutation(async (data) =>
    axios
      .post(
        `/visit/radiology/measure/attachment/${attachmentId}/update-attachment`,
        data
      )
      .then((res) => res.data)
  )
  const { status: attchStatus } = useQuery(
    `visit-radiology-measure-attachment-${attachmentId}-edit-attachment`,
    async () =>
      axios
        .get(
          `/visit/radiology/measure/attachment/${attachmentId}/edit-attachment`
        )
        .then((res) => res.data),
    {
      onSuccess:
        /** @param {import("interfaces/attachment").RadiologyAttch} data */
        (data) => {
          setInitialValues({
            photo_name: data.photo_name,
            photo_path: data.photo_path,
          })
        },
    }
  )
  return (
    <>
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
              navigate(-1)
            } else {
              setSubmitStatus({})
            }
          }}
          confirmBtnText="OK mengerti"
        >
          <div className="text-gray-600 mb-5">{submitStatus?.message}</div>
        </SweetAlert>
      )}
      <Modal dialogClassName="mw-600px" show="true" animation={false}>
        <Modal.Header>
          <Modal.Title as="h3" className="me-3">
            Detail lampiran
          </Modal.Title>
          <GrayCrossIcon
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </Modal.Header>
        <Modal.Body className="px-20">
          {attchStatus === "error" && (
            <div className="d-flex flex-center min-h-400px">
              <div className="text-gray-600">Error...</div>
            </div>
          )}
          {attchStatus === "loading" && (
            <div className="d-flex flex-center min-h-400px">
              <div className="text-gray-600">Loading...</div>
            </div>
          )}
          {attchStatus === "success" && (
            <>
              <PreviewAttch>
                <PreviewAttchScroll>
                  <img
                    src={`${process.env.REACT_APP_STORAGE_URL}/${formik.values.photo_path}`}
                    className="img-fluid w-100"
                    alt={formik.values.photo_name}
                  />
                </PreviewAttchScroll>
              </PreviewAttch>
              <div className="row form-group mb-4">
                <div className="col-md-9">
                  <input
                    id="photo_name"
                    type="text"
                    autoComplete="off"
                    className={dynamicFormControlClass(formik, "photo_name")}
                    {...formik.getFieldProps("photo_name")}
                  />
                  {formik.touched.photo_name && formik.errors.photo_name && (
                    <span className="invalid-feedback" type="invalid">
                      {formik.errors.photo_name}
                    </span>
                  )}
                </div>
                <div className="col-md-3">
                  <button
                    onClick={() => formik.submitForm()}
                    className="btn btn-primary w-100"
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!formik.isSubmitting && (
                      <span className="indicator-label fw-medium">Simpan</span>
                    )}
                    {formik.isSubmitting && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

/**
 * Komponen modal untuk mengupload lampiran
 */
function UploaAttchModal() {
  const navigate = useNavigate()
  const { requestId, actionId } = useParams()
  const queryClient = useQueryClient()
  const formik = useFormik({
    initialValues: {
      photo_name: "",
      photo: "",
    },
    validationSchema: Yup.object().shape({
      photo_name: Yup.string().required("Kolom ini wajib untuk diisi"),
      photo: Yup.mixed().required("Kolom ini wajib untuk diisi"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true)
      mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            `visit-radiology-${requestId}-measure-${actionId}-listing-attachment`
          )
          setSubmitting(false)
          success({
            text: "Lampiran berhasil diupload",
          })
          navigate(-1)
        },
        onError: (err) => {
          setSubmitting(false)
          switch (err.response.status) {
            case 422:
              const errors = err.response.data.errors
              formik.setErrors({
                ...formik.errors,
                ...errors,
              })
              break

            default:
              error({
                text: "Lampiran berhasil diupload",
              })
              break
          }
        },
      })
    },
  })

  const { mutate } = useMutation(async (data) =>
    axios
      .post(
        `/visit/radiology/${requestId}/measure/${actionId}/store-attachment`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => res.data)
  )

  return (
    <Modal dialogClassName="mw-600px" show="true" animation={false}>
      <Modal.Header>
        <Modal.Title as="h3" className="me-3">
          Upload lampiran
        </Modal.Title>
        <GrayCrossIcon
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </Modal.Header>
      <Modal.Body className="px-20">
        <div className="form-group mb-4">
          <label
            htmlFor="photo_name"
            className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
          >
            Nama
          </label>
          <input
            id="photo_name"
            type="text"
            autoComplete="off"
            className={dynamicFormControlClass(formik, "photo_name")}
            {...formik.getFieldProps("photo_name")}
          />
          {formik.touched.photo_name && formik.errors.photo_name && (
            <span className="invalid-feedback" type="invalid">
              {formik.errors.photo_name}
            </span>
          )}
        </div>
        <div className="form-group mb-15">
          <label
            htmlFor="photo"
            className="form-label fs-6 fw-medium text-gray-700 mt-sm-3 mt-0"
          >
            Lampiran
          </label>
          <div
            class={clsx(
              "input-group mb-3",
              {
                "is-invalid": formik.touched.photo && formik.errors.photo,
              },
              {
                "is-valid": formik.touched.photo && !formik.errors.photo,
              }
            )}
          >
            <input
              type="text"
              value={formik.values.photo?.name ?? ""}
              className={dynamicFormControlClass(formik, "photo")}
              readOnly={true}
            />
            <label
              htmlFor="photo"
              class="input-group-text border-0 cursor-pointer text-gray-600"
            >
              Choose file
            </label>
          </div>
          {formik.touched.photo && formik.errors.photo && (
            <span className="invalid-feedback" type="invalid">
              {formik.errors.photo}
            </span>
          )}
          <input
            id="photo"
            type="file"
            autoComplete="off"
            className="d-none"
            onChange={(event) => {
              checkFileSize(formik, "photo", event.currentTarget.files[0])
            }}
          />
        </div>
        <div className="mb-10">
          <FormikSubmitButton formik={formik} />
        </div>
      </Modal.Body>
    </Modal>
  )
}

/**
 * Komponen modal bantuan untuk mengupload lampiran
 */
function HelpAttchModal() {
  const navigate = useNavigate()
  return (
    <Modal dialogClassName="mw-600px" show="true" animation={false}>
      <Modal.Header>
        <Modal.Title as="h3">Bantuan</Modal.Title>
        <GrayCrossIcon
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </Modal.Header>
      <Modal.Body className="px-20">
        <div className="mb-10">
          <p className="text-gray-700">
            Beberapa hal yang perlu Anda perhatikan saat mengupload lampiran :
          </p>
          <ul className="text-gray-700">
            <li className="mb-2">Lampiran harus berupa gambar.</li>
            <li className="mb-2">
              Pastikan gambar yang diupload adalah gambar dengan kualitas
              terbaik agar mudah untuk dimengerti maupun dibaca.
            </li>
            <li className="mb-2">
              Dimensi gambar bebas dengan orientasi yang disarankan adalah
              vertikal.
            </li>
            <li className="mb-2">
              Size gambar yang boleh diupload maksimal 6 MB.
            </li>
            <li className="mb-2">
              Format gambar yang boleh diupload adalah jpg, jpeg, dan png.
            </li>
            <li className="mb-2">
              Banyaknya gambar yang diupload berjumlah maksimal 10 item.
            </li>
          </ul>
        </div>
        <div className="d-flex flex-center mb-5">
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Back
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

/**
 * Memvalisasi ukuran maksimal lampiran yang di upload
 * @param {*} formik
 * @param {FileList} file
 * @param {Number} maxFileSize
 */
function checkFileSize(formik, name, file, maxFileSize = 6) {
  const fileSize = file?.size / 1024 / 1024 // satuan MB
  formik.setFieldTouched(name)
  if (fileSize > maxFileSize) {
    setTimeout(() => {
      formik.setFieldError(
        name,
        `Ukuran maksimal lampiran adalah ${maxFileSize} MB`
      )
    }, 500)
  } else {
    formik.setFieldValue(name, file)
  }
}

/**
 * Komponen toolbar edit aksi radiologi
 * @param {{
 * actionQuery: import("react-query/types/react/types").UseQueryResult
 * }}
 * @returns
 */
function Toolbar({ actionQuery }) {
  const navigate = useNavigate()
  /** @type {import("interfaces/action").DetailRadiologyAction} */
  const actionData = actionQuery.data
  const actionStatus = actionQuery.status

  return (
    <>
      <div className="toolbar mt-n2 mt-md-n3 mt-lg-0" id="kt_toolbar">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-sm-6 d-flex align-items-center mb-5 mb-sm-0 text-truncate">
              <ButtonLightStyled
                onClick={() => navigate(-1)}
                className="btn btn-icon btn-light-primary flex-shrink-0 me-8"
              >
                <PrimaryArrowLeftIcon />
              </ButtonLightStyled>
              {actionStatus === "success" && (
                <>
                  <h1 className="fs-3 mb-0 me-4">{actionData.name}</h1>
                </>
              )}
            </div>
            {actionStatus === "success" && (
              <div className="col-sm-6 d-flex justify-content-start justify-content-sm-end">
                <ButtonDetailPatient visitId={actionData.visit_id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
