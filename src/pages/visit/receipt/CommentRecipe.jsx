import { defaultModules, defaults, error, success } from "@pnotify/core"
import "@pnotify/core/dist/PNotify.css"
import * as PNotifyMobile from "@pnotify/mobile"
import "@pnotify/mobile/dist/PNotifyMobile.css"
import "assets/css/custom-pnotify.css"
import { ReactComponent as PrimaryChatIcon } from "assets/icons/primary-chat.svg"
import { ReactComponent as WarningRestartIcon } from "assets/icons/warning-restart.svg"
import { ReactComponent as WhitePaperPlaneIcon } from "assets/icons/white-paper-plane.svg"
import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import { useFormik } from "formik"
import { dynamicFormControlClass } from "helpers/formik-helper"
import { truncate } from "helpers/string-helper"
import React from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useLocation, useParams } from "react-router"
import * as Yup from "yup"

// setting pnotify
defaultModules.set(PNotifyMobile, {})
defaults.delay = 2000
defaults.sticker = false

// komponen utama comment recipe
export default function CommentRecipe() {
  const queryClient = useQueryClient()
  const { receiptId } = useParams()
const location=useLocation()
  // mengambil listing resep
  const { data: commentData, status: commentStatus } = useQuery(
    `visit-recipe-${receiptId}-comment`,
    async () =>
      axios.get(`visit/recipe/${receiptId}/comment`).then((res) => res.data),
    {
      refetchInterval: 5000,
    }
  )

  // method post untuk menambahkan komen
  const { mutate } = useMutation(async (data) =>
    axios
      .post(`/visit/recipe/${receiptId}/store-comment`, data)
      .then((res) => res.data)
  )

  // konfigurasi formik
  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: Yup.object().shape({
      message: Yup.string().required("Kolom ini wajib untuk diisi"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true)
      mutate(values, {
        onSuccess: function () {
          queryClient.invalidateQueries(`visit-recipe-${receiptId}-comment`)
          resetForm()
          setSubmitting(false)
          success({
            text: "Sudah terkirim",
          })
        },
        onError: function () {
          resetForm()
          setSubmitting(false)
          error({
            text: "Gagal terkirim",
          })
        },
      })
    },
  })
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <h1 className="fs-3 m-0">Komentar</h1>
            <div className="rounded d-flex flex-center h-30px w-30px bg-light-primary">
              <div className="text-primary fw-bold">{commentData?.length}</div>
            </div>
          </div>
        </div>
        <div className="card-body overflow-auto mh-300px d-flex flex-column-reverse">
          {commentStatus === "loading" && <PrimaryLoader />}
          {commentStatus === "error" && <ErrorMessage />}
          {commentStatus === "success" && (
            <>
              {commentData.length === 0 ? (
                <div className="d-flex flex-column flex-center min-h-200px">
                  <PrimaryChatIcon className="mb-5" />
                  <p className="w-200px text-center text-gray-600">
                    Belum ada komentar dari laboratorium
                  </p>
                </div>
              ) : (
                <>
                  {location.pathname.includes('pharmacy') ?                 
                  commentData.map((data, key) => {
                    /** @type {import("interfaces/message").Message} */
                    const comment = data

                if (comment.user_role.toLowerCase().includes("apo")) {
                  return (
                    <React.Fragment key={key}>
                      <div className="rounded bg-primary p-4 mb-4">
                        <p className="text-white mb-1">{comment.message}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p>{truncate(comment.user_name, 15)}</p>
                        <small className="text-gray-600">
                          {comment.created_at}
                        </small>
                      </div>
                    </React.Fragment>
                  )
                }

                return (
                  <React.Fragment key={key}>
                    <div className="rounded bg-light-primary p-4 mb-4">
                      <p className="text-gray-800 mb-1">
                        {comment.message}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>{truncate(comment.user_name, 15)}</p>
                      <small className="text-gray-600">
                        {comment.created_at}
                      </small>
                    </div>
                  </React.Fragment>
                )
                  })
                
                :
                commentData.map((data, key) => {
                  /** @type {import("interfaces/message").Message} */
                  const comment = data

              if (!comment.user_role.toLowerCase().includes("apo")) {
                return (
                  <React.Fragment key={key}>
                    <div className="rounded bg-primary p-4 mb-4">
                      <p className="text-white mb-1">{comment.message}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <p>{truncate(comment.user_name, 15)}</p>
                      <small className="text-gray-600">
                        {comment.created_at}
                      </small>
                    </div>
                  </React.Fragment>
                )
              }

              return (
                <React.Fragment key={key}>
                  <div className="rounded bg-light-primary p-4 mb-4">
                    <p className="text-gray-800 mb-1">
                      {comment.message}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>{truncate(comment.user_name, 15)}</p>
                    <small className="text-gray-600">
                      {comment.created_at}
                    </small>
                  </div>
                </React.Fragment>
              )
                })
                
                }
                </>
              )}
            </>
          )}
        </div>
        <div className="card-footer">
          <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <div className="mb-4">
              <textarea
                {...formik.getFieldProps("message")}
                placeholder="Mulai atau balas komentar"
                rows={3}
                className={dynamicFormControlClass(formik, "message")}
              ></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <ButtonLightStyled
                type="reset"
                className="btn btn-icon btn-light-warning me-3"
              >
                <WarningRestartIcon />
              </ButtonLightStyled>
              <button
                disabled={formik.isSubmitting || !formik.isValid}
                type="submit"
                className="btn btn-icon btn-primary"
              >
                <WhitePaperPlaneIcon />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
