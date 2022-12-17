import axios from "axios"
import { useNavigate } from "react-router"
import React, { useState, useMemo } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQueryClient } from "react-query"

export default function DeleteModalMethode({
  url,
  query,
  message,
  htmlMessage,
  successMessage,
  type,
  isDiagnosa
}) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({})
  const navigate = useNavigate()
  const mutation = useMutation(
    async (url) => {
      setLoading(true)
      return axios
        .delete(url)
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
        onConfirm={() => mutation.mutate(url)}
        confirmBtnText={loading ? "Please wait..." : isDiagnosa ? "Ya, benar" :"Ya, hapus"}
        showCancel={true}
        onCancel={() => navigate(-1, { replace: true })}
        cancelBtnCssClass="text-gray-600"
        cancelBtnText={isDiagnosa? "Tidak Jadi"  :"Tidak, batalkan"}
        confirmBtnCssClass={`btn btn-danger me-5 ${loading ? "disabled" : ""}`}
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
      <InfoAlert submitStatusState={[submitStatus, setSubmitStatus]} type={type} />
    </>
  )
}

export function InfoAlert({ submitStatusState,type }) {
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
              if(type === "back"){
              navigate(-2)}else{
                navigate(-1)
              }
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
