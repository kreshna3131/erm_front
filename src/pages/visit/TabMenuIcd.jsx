import axios from "axios"
import clsx from "clsx"
import { useQuery } from "react-query"
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router"
import styled from "styled-components"

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

export default function TabMenuIcd() {
  const { id: visitId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { allPermissions } = useOutletContext()

  return (
    <div className="card-header  px-10 ">
      <div className="d-flex flex-center">
        <TabMenuItem
          active={location.pathname.includes(`/diagnosa-nine`)}
          onClick={() => {
            navigate(`/visit/${visitId}/icd/diagnosa-nine`, { replace: true })
          }}
        >
          <div className="">Diagnosa 9</div>
        </TabMenuItem>
        {allPermissions.includes("lihat icd 10") && (
          <TabMenuItem
            active={location.pathname.includes(`/diagnosa-ten`)}
            onClick={() => {
              navigate(`/visit/${visitId}/icd/diagnosa-ten`, { replace: true })
            }}
          >
            <div className="">Diagnosa 10</div>
          </TabMenuItem>
        )}
      </div>
    </div>
  )
}
