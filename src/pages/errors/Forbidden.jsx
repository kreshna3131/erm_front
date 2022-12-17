import { useNavigate } from "react-router-dom"

export default function Forbidden() {
  const navigate = useNavigate()

  return (
    <div className="vh-100 d-flex flex-center flex-column">
      <h1 className="fs-4x text-gray-600 mb-10">403 | Forbidden</h1>
      <button
        onClick={() => navigate("/")}
        type="button"
        className="btn btn-primary"
      >
        Back to home
      </button>
    </div>
  )
}
