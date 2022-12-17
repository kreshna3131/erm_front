import axios from "axios"
import React, { useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router"


/**
 * Komponen modal update yang reusable
 * @param {{
 * url: String
 * data: *
 * query: String
 * message: String
 * htmlMessage: String
 * successMessage: String
 * }}
 */



export default function UpdateModal({
  url,
  data,
  query,
  message,
  htmlMessage,
  successMessage,
}) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const navigate = useNavigate()

  const mutation = useMutation(
    async ({ url, data,dataFormik }) => {
      setLoading(true)
      return axios
        .post(url, {
          ...{
            _method: "PATCH",
          },
          ...data
        })
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          queryClient.invalidateQueries(query)
          setSubmitStatus({
            status: "success",
            message: successMessage,
          })
        }, 500)
      },
      onError: () => {
        setLoading(false)
        setSubmitStatus({
          status: "danger",
          message:
            "Maaf, sepertinya ada beberapa kesalahan yang terdeteksi, silakan coba lagi.",
        })
      },
    }
  )

 
  return (
    <>
      <SweetAlert
        warning
        title=""
        onConfirm={() => mutation.mutate({ url, data })}
        confirmBtnText={loading ? "Please wait..." : "Ya, benar"}
        showCancel={true}
        onCancel={() => navigate(-1)}
        cancelBtnCssClass="text-gray-600"
        cancelBtnText="Tidak jadi"
        confirmBtnCssClass={`btn btn-danger me-5 ${loading  ? "disabled" : ""} `}
        reverseButtons={true}
        customClass="p-10 rounded"
        openAnim={false}
        closeAnim={false}
        style={{
          width: "364px",
          minHeight: "322px",
        }}
      >
        {message && <p className="text-gray-700 text-center">{message}</p>}
       
        {htmlMessage && (
          <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
        )}
      </SweetAlert>
      <InfoAlert submitStatusState={[submitStatus, setSubmitStatus]} />
    </>
  )
}

/**
 * Komponen alert yang muncul setelah update berhasil dilakukan
 * @param {{
 * submitStatusState: Array
 * }}
 */
export function InfoAlert({ submitStatusState }) {
  const [submitStatus, setSubmitStatus] = submitStatusState
  const navigate = useNavigate()

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
    </>
  )
}
