import axios from "axios"
import React from "react"

import useBreadcrumb from "hooks/useBreadcrumb"

import { ReactComponent as DangerArrow } from "assets/icons/danger-arrow-right.svg"

import { ReactComponent as DangerGlassIcon } from "assets/icons/danger-glass.svg"
import { ReactComponent as DangerDocumentFavoriteIcon } from "assets/icons/danger-document-favorite.svg"
import { ReactComponent as DangerRadiologyIcon } from "assets/icons/danger-radiology.svg"
import { ReactComponent as DangerNoteIcon } from "assets/icons/danger-note.svg"
import { isTruncated, truncate } from "helpers/string-helper"
import {OverlayTrigger, Tooltip } from "react-bootstrap"
import { ButtonLightStyled } from "components/Button"
import { useNavigate } from "react-router-dom"
import {  useOutletContext } from "react-router"

import { HoverBorderedTrBg } from "components/table/TableRow"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import Pusher from "pusher-js"
import Echo from "laravel-echo"
import useAuth from "hooks/useAuth"
import { useMutation, useQuery, useQueryClient } from "react-query"
const breadCrumbJson = {
  title: "Notifications",
  items: [{ text: "Notifications", path: null }],
}

// komponen utama pharmacy
export default function Index() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()


  useBreadcrumb(breadCrumbJson)

  const createdTruncateLength = 30

  // get listing notification

  const { data: newNotification, status } = useQuery(
    "notification-listing",
    async (key) => {
      return axios.get("/notification/listing").then((res) => res.data)
    }
  )


  // logic notif sudah dibaca
  const mutation = useMutation(
    async (data) => {
      return axios
        .delete(`/notification/${data.id}/read`)
        .then((res) =>res.data)
    },
    {onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries('notification-listing')
       
      }, 500)
    },}
   
  )

  const { user } = useOutletContext()

  // button menuju detail halaman sekaligus read notif
const buttonToDetail=(data)=>{
  const type =data.recipe_type.split(",")
    if (data.type === "Radiologi") {
      if (!user?.roles[0]?.name.toLowerCase().includes("rad")) {
          navigate (`/visit/${data.visit_id}/radiology/${data.request_id}`)      
      } else {
          navigate (`/radiology/request/${data.request_id}`)       
      }
    }
    if (data.type === "Laboratorium") {
      if (!user?.roles[0]?.name.toLowerCase().includes("lab")) {
          navigate (`/visit/${data.visit_id}/laboratory/${data.request_id}`)
     
      } else {
          navigate (`/laboratory/request/${data.request_id}/detail`)
       
      }
    }
  
    if (data.type === "E Resep") {
      if (!user?.roles[0]?.name.toLowerCase().includes("apo")) {
          if(type && type.length === 1 && type[0] === "Non Racikan"){
          navigate (`/visit/${data.visit_id}/receipt/${data.request_id}/non-concoction`)}else{
            navigate (`/visit/${data.visit_id}/receipt/${data.request_id}/concoction`)
          }
       
      } else {
          if(type && type.length === 1 && type[0] === "Non Racikan"){
          navigate (`/pharmacy/request/${data.visit_id}/receipt/${data.request_id}/non-concoction`)
          
        }else{

          navigate (`/pharmacy/request/${data.visit_id}/receipt/${data.request_id}/concoction`)
        }
       
      }
    }
  
    if (data.type === "Rehab Medic") {
      if (!user?.roles[0]?.name.toLowerCase().includes("rehab")) {
          navigate (`/visit/${data.visit_id}/rehab/${data.request_id}`)
       
      } else {
          navigate (`/rehab-medic/${data.request_id}`)
        } 
      }
  mutation.mutate(data)
}
  return (
    <div className="post d-flex flex-column-fluid" id="kt_post">
      <div id="kt_content_container" className="container-fluid">
        <div className="card">
          <div className="card-body p-10">
            {status === "loading" && <PrimaryLoader className="min-h-400px" />}
            {status === "error" && <ErrorMessage className="min-h-400px" />}
            {status === "success" && (
              <>
                <table className="table  table-hover ">
                  <tbody>
                    {newNotification && newNotification?.data.length === 0 && (
                      <tr>
                        <td colSpan={7}>
                          <center className="text-gray-600">
                            Belum ada data yang dapat ditampilkan
                          </center>
                        </td>
                      </tr>
                    )}
                    {newNotification?.data.map((data, key) => (
                      <HoverBorderedTrBg key={`data-table-${key}`}>
                        <th className="align-middle text-gray-700">
                          <div className="d-flex">
                            {data.type === "Laboratorium" && (
                              <DangerGlassIcon className="me-2" />
                            )}
                            {data.type === "Radiologi" && (
                              <DangerRadiologyIcon className="me-2" />
                            )}
                            {data.type === "Rehab Medic" && (
                              <DangerDocumentFavoriteIcon className="me-2" />
                            )}
                            {data.type === "E Resep" && (
                              <DangerNoteIcon className="me-2" />
                            )}
                            <span>{data.type}</span>
                          </div>
                        </th>
                        <th className="align-middle text-gray-700">
                        {data.created_by &&
                          isTruncated(
                            data.created_by,
                            createdTruncateLength
                          ) ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-${key}`}>
                                  {data.created_by}
                                </Tooltip>
                              }
                            >
                              <span>
                                {truncate(
                                  data.created_by,
                                  createdTruncateLength
                                )}
                              </span>
                            </OverlayTrigger>
                          ) : (
                            <>{data.created_by}</>
                          )}
                        </th>
                      
                       
                        <th className="align-middle text-gray-700">
                        telah {data.message}
                        </th>
                        <th className="align-middle text-gray-700">
                         Sekitar {data.notification_at}
                      
                        </th>
                        <th className="align-middle">
                          <div className="d-flex ">
                            <ButtonLightStyled
                              className="btn btn-icon btn-light-danger "
                              onClick={() =>
                                buttonToDetail(data)
                              }
                            >
                              <DangerArrow />
                            </ButtonLightStyled>
                          </div>
                        </th>
                      </HoverBorderedTrBg>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


