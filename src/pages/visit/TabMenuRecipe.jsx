import axios from "axios"
import { useQuery } from "react-query"
import { useLocation, useNavigate, useParams } from "react-router"
import styled from "styled-components"
import { ReactComponent as SoapIcon } from "../../assets/icons/document.svg"
import { ReactComponent as LaboratoryIcon } from "../../assets/icons/laboratory.svg"
import { ReactComponent as RadiologyIcon } from "../../assets/icons/radiology.svg"
import { ReactComponent as ReceiptIcon } from "../../assets/icons/receipt.svg"
import { ReactComponent as RehabIcon } from "../../assets/icons/rehab.svg"
import { ReactComponent as WarningExclamationLabIcon } from "../../assets/icons/warning-exclamation-lab.svg"

const TabMenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  margin-right: 10px;
  padding-right: 10px;
  padding-left: 10px;
  svg:not(.opacity-exception),
  div:not(.opacity-exception) {
    opacity: ${(props) => (props.active ? "1" : "0.5")};
    color: ${(props) => (props.active ? "#0d9a89" : "gray")};
  }

  &:after {
    content: "";
    height: ${(props) => (props.active ? "3px" : "0px")};
    position: absolute;
    right: 0;
    left: 0;
    top: 44px;
    background-color: #0d9a89;
  }
`

const IsReadWarning = styled.div`
  position: absolute;
  top: -33px;
  left: 50%;
  width: 24px;
  display: ${(props) => (props.show ? "block" : "none")};
  transform: translateX(-20%);
`

export default function TabMenuRecipe({ recipeQuery }) {
  const { id: visitId, receiptId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const isReadQuery = useQuery(
    `visit-${visitId}-laboratorium-check-is-read`,
    async () =>
      axios
        .get(`/visit/${visitId}/laboratorium/check-is-read`)
        .then((res) => res.data)
  )

  const type =
    recipeQuery?.status === "success" && recipeQuery?.data?.type.split(",")
  return (
    <div className="card-header  px-10 ">
      {type && type?.length === 2 ? (
        <div className="d-flex flex-center">
          <TabMenuItem
            active={location.pathname.includes(
              `/concoction`
            )}
            onClick={() =>{
              if(location.pathname.includes('pharmacy')){
                navigate(`/pharmacy/request/${visitId}/receipt/${receiptId}/concoction`,{replace:true})
              }else{
              navigate(`/visit/${visitId}/receipt/${receiptId}/concoction`,{replace:true})}}
            }
          >
            <div className="">Racikan</div>
          </TabMenuItem>
          <TabMenuItem
            active={location.pathname.includes(
              `non-concoction`
            )}
            onClick={() =>{
              if(location.pathname.includes('pharmacy')){
                navigate(`/pharmacy/request/${visitId}/receipt/${receiptId}/non-concoction`,{replace:true})
              }else{

              navigate(`/visit/${visitId}/receipt/${receiptId}/non-concoction`,{replace:true})}}
            }
          >
            <div className="">Non Racikan</div>
          </TabMenuItem>
        </div>
      ) : type && type.length === 1 && type[0] === "Racikan" ? (
        <div className="d-flex flex-center">
          <TabMenuItem
            active={location.pathname.includes(
              `/concoction`
            )}
            onClick={() =>{
              if(location.pathname.includes('pharmacy')){
                navigate(`/pharmacy/request/${visitId}/receipt/${receiptId}/concoction`,{replace:true})
              }else{
              navigate(`/visit/${visitId}/receipt/${receiptId}/concoction`,{replace:true})}}
            }
          >
            <div className="">Racikan</div>
          </TabMenuItem>
        </div>
      ) : (
        <div className="d-flex flex-center">
          <TabMenuItem
            active={location.pathname.includes(
              `non-concoction`
            )}
            onClick={() =>
              {
                if(location.pathname.includes('pharmacy')){
                  navigate(`/pharmacy/request/${visitId}/receipt/${receiptId}/non-concoction`,{replace:true})
                }else{
  
                navigate(`/visit/${visitId}/receipt/${receiptId}/non-concoction`,{replace:true})}}
            }
          >
            <div className="">Non Racikan</div>
          </TabMenuItem>
        </div>
      )}
    </div>
  )
}
