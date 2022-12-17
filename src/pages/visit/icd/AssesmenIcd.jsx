
import { ReactComponent as PrimaryFolderIcon } from "assets/icons/primary-folder.svg"
import { ReactComponent as PrimaryDocumentIcon } from "assets/icons/primary-document.svg"
import { ReactComponent as WarningPreviewIcon } from "assets/icons/warning-preview.svg"

import axios from "axios"
import { ButtonLightStyled } from "components/Button"
import PrimaryLoader, { ErrorMessage } from "components/Loader"

import React, { useState } from "react"
import {  useQuery} from "react-query"
import { useNavigate, useParams } from "react-router"
import FooterPaginate from "components/table/FooterPaginate"



// komponen utama Assesment Icd
export default function AsessmenIcd() {
  const { id: visitId } = useParams()
  const navigate = useNavigate()
  const [filter, setFilter] = useState({
    page: 1,
    pagination: 5,
  })

  // mengambil listing assesment
  const { data: assesmentData, status: assesmenStatus } = useQuery(
    [`visit-${visitId}-icd-listing-assesment`,filter],
    async (key) =>
      axios
        .get(`visit/${visitId}/icd/listing-assesment`, {
          params: key.queryKey[1],
        })
        .then((res) => res.data)
  )

  return (
    <>
      <div className="card">
        <div className="card-header border-0">
          <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="d-flex align-items-center  ">
              <div className="rounded-circle d-flex flex-center h-40px w-40px  bg-light-primary me-4">
                <PrimaryDocumentIcon />
              </div>
              <h1 className="fs-5 m-0">Assesmen</h1>
            </div>
            <div className="rounded d-flex flex-center h-30px w-30px bg-light-primary">
              <div className="text-primary fw-bold">
                {assesmentData?.data.length}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body  mh-400px d-flex flex-column">
          {assesmenStatus === "loading" && <PrimaryLoader />}
          {assesmenStatus === "error" && <ErrorMessage />}
          {assesmenStatus === "success" && (
            <>
              {assesmentData?.data.length === 0 ? (
                <div className="d-flex flex-column flex-center min-h-200px">
                  <PrimaryFolderIcon className="mb-5" />
                  <p className="w-200px text-center text-gray-600">
                    Belum ada assesmen apapun untuk pasien ini
                  </p>
                </div>
              ) : (
                <>
                  {assesmentData.data.map((data, key) => {
                    return (
                    <div key={key} className="border-top ">
                        <div
                          
                          className="d-flex align-middle justify-content-between mt-5 mb-5 "
                        >
                          <div className="d-flex flex-column ">
                            <span className="fs-6 text-gray-800">
                              Assesmen {data.sub_assesment_type}
                            </span>
                            <span className="text-gray-600" >{data.created_at}</span>
                          </div>
                          <ButtonLightStyled
                            onClick={() =>
                              window.open(
                                `/visit/${visitId}/soap/${data.soap_id}/document/${data.assesment_id}/sub-document/${data.sub_assesment_id}/edit`
                              )
                            }
                            className="btn btn-icon btn-light-warning "
                          >
                            {<WarningPreviewIcon />}
                          </ButtonLightStyled>
                        </div>
                    </div>
                    )
                  })}
                  <span className="border-top "></span>
                </>
              )}
            </>
          )}
        </div>
        <div className="card-footer border-0">
          <FooterPaginate
            data={assesmentData ? assesmentData : []}
            filterProp={[filter, setFilter]}
          />
        </div>
      </div>
    </>
  )
}
