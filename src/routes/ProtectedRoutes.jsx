import axios from "axios"
import DynamicSoapType from "pages/visit/DynamicSoapType"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminLayout from "../components/layouts/admin/Index"
import useAuth from "../hooks/useAuth"
import { Layout as AuthLayout } from "../pages/auth/Layout"
import TwoFactor from "../pages/auth/TwoFactor"
import Forbidden from "../pages/errors/Forbidden"
import NotFound from "../pages/errors/NotFound"
import DetailLab from "../pages/lab/request/DetailLab"
import Lab from "../pages/lab/request/Index"
import LogActivity from "../pages/logactivity/Index"
import CreateRole from "../pages/role/Create"
import EditRole from "../pages/role/Edit"
import Role from "../pages/role/Index"
import EditAssessmentSetting from "../pages/settings/assessment/Edit"
import AssessmentSetting from "../pages/settings/assessment/Index"
import Specialist from "../pages/specialist/Index"
import CreateUser from "../pages/user/Create"
import EditUser from "../pages/user/Edit"
import User from "../pages/user/Index"
import Visit from "../pages/visit/Index"
import AddRequest from "../pages/visit/laboratory/AddRequest"
import EditLaboratory from "../pages/visit/laboratory/Edit"
import Laboratory from "../pages/visit/laboratory/Index"
import Radiology from "../pages/visit/radiology/Index"
import AddRequestRadiology from "../pages/visit/radiology/AddRequest"
import AddActionRadiology from "../pages/visit/radiology/AddAction"
import EditRadiology from "../pages/visit/radiology/Edit"
import Receipt from "../pages/visit/receipt/Index"
import EditConcoction from "../pages/visit/receipt/concoction/EditConcoction"
import DetailConcoction from "../pages/visit/receipt/concoction/detail/DetailConcoction"
import EditNonConcoction from "../pages/visit/receipt/non-concoction/EditNonConcoction"

import EditDiagnosaTen from "../pages/visit/icd/diagnosa-ten/EditDiagnosaTen"
import EditDiagnosaNine from "../pages/visit/icd/diagnosa-nine/EditDiagnosaNine"

import Rehab from "../pages/visit/rehab/Index"
import CreateRehab from "../pages/visit/rehab/Create"
import EditRehab from "../pages/visit/rehab/Edit"
import AddActionRehab from "../pages/visit/rehab/AddAction"
import EditDocument from "../pages/visit/soap/assessment/Edit"
import Assessment from "../pages/visit/soap/assessment/Index"
import CreateAssessment from "../pages/visit/soap/assessment/Create"
import Inspection from "../pages/visit/soap/inspection/Index"
import CreateNursingInspection from "../pages/visit/soap/inspection/create/Nursing"
import EditNursingInspection from "../pages/visit/soap/inspection/edit/Nursing"
import CreateMedicInspection from "../pages/visit/soap/inspection/create/Medic"
import EditMedicInspection from "../pages/visit/soap/inspection/edit/Medic"
import Resume from "../pages/visit/soap/resume/Index"
import DetailSoap from "../pages/visit/soap/Detail"
import Soap from "../pages/visit/soap/Index"
import CreateSoap from "../pages/visit/soap/Create"
import AddAction from "pages/visit/laboratory/AddAction"
import LaboratoryResult from "pages/lab/result/Index"
import DetailLaboratoryResult from "pages/lab/result/Detail"
import DataMasterRadiologyGroup from "pages/datamaster/radiology/group/Index"
import DataMasterRadiologySubGroup from "pages/datamaster/radiology/subgroup/Index"
import PharmacyRequest from "pages/pharmacy/Index"
import RadiologyRequest from "pages/radiology/Index"
import RadiologyRequestDetail from "pages/radiology/Detail"
import RadiologyRequestEdit from "pages/radiology/action/Edit"
import RehabMedic from "../pages/rehabmedic/Index"
import DetailRehab from "../pages/rehabmedic/Detail"
import Notification from "../pages/notification/Index"
import Profile from "../pages/profile/Index"

export default function ProtectedRoutes() {
  const { token } = useAuth()

  axios.defaults.headers.common = {
    Authorization: `Bearer ${token}`,
    Accept: "Application/json",
  }

  return (
    <BrowserRouter basename="">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/two-factor" element={<TwoFactor />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Visit />} />
          <Route path="/visit" element={<Visit />} />

          {/* Route Notification */}
          <Route path="/notification" element={<Notification />} />

          {/* Route profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Route sopa kunjungan */}
          <Route path="/visit/:id/soap" element={<Soap />} />
          <Route path="/visit/:id/soap/create" element={<CreateSoap />} />
          <Route path="/visit/:id/soap/:soapId" element={<DetailSoap />} />
          <Route
            path="/visit/:id/soap/:soapId/create"
            element={<CreateAssessment />}
          />
          <Route path="/visit/:id/soap/check-flow" element={<Soap />} />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/status/:status"
            element={<DetailSoap />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId"
            element={<Assessment />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/detail-patient"
            element={<Assessment />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/status/:status/detail"
            element={<Assessment />}
          />
          {/* edit assesment */}
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/sub-document/:subDocumentId/edit"
            element={<EditDocument />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/sub-document/:subDocumentId/edit/detail-patient"
            element={<EditDocument />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/sub-document/:subDocumentId/edit/detail-author/:authorId"
            element={<EditDocument />}
          />

          {/* Route hasil terintegrasi */}
          <Route path="/visit/:id/soap/inspection" element={<Inspection />} />
          <Route
            path="/visit/:id/soap/inspection/create"
            element={<Inspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId"
            element={<Inspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/status/:status"
            element={<Inspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/create/nursing"
            element={<CreateNursingInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/nursing"
            element={<EditNursingInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/nursing/status/:status"
            element={<EditNursingInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/create/nursing/detail-patient"
            element={<CreateNursingInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/nursing/detail-patient"
            element={<EditNursingInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/create/nursing/detail-author"
            element={<CreateNursingInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/nursing/detail-author"
            element={<EditNursingInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/create/medic"
            element={<CreateMedicInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/medic"
            element={<EditMedicInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/medic/status/:status"
            element={<EditMedicInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/medic/detail-patient"
            element={<EditMedicInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/medic/detail-author"
            element={<EditMedicInspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/:inspectionId/delete"
            element={<Inspection />}
          />
          <Route
            path="/visit/:id/soap/inspection/detail-patient"
            element={<Inspection />}
          />

          {/* Route hasil resume */}
          <Route path="/visit/:id/soap/resume" element={<Resume />} />
          <Route path="/visit/:id/soap/resume/create" element={<Resume />} />
          <Route path="/visit/:id/soap/resume/:resumeId" element={<Resume />} />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/inspection/detail-patient"
            element={<Inspection />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/resume"
            element={<Resume />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/resume/create"
            element={<Resume />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/resume/:resumeId"
            element={<Resume />}
          />
          <Route
            path="/visit/:id/soap/:soapId/document/:documentId/resume/:resumeId/delete"
            element={<Resume />}
          />
          <Route
            path="/visit/:id/soap/resume/detail-patient"
            element={<Resume />}
          />

          {/* Route laboratorium kunjungan */}
          <Route path="/visit/:id/laboratory" element={<Laboratory />} />
          <Route
            path="/visit/:id/laboratory/:laboratoryId/action/create"
            element={<AddAction />}
          />
          <Route
            path="/visit/:id/laboratory/:laboratoryId"
            element={<EditLaboratory />}
          />
          <Route
            path="/visit/:id/laboratory/:laboratoryId/detail-patient"
            element={<EditLaboratory />}
          />
          <Route
            path="/visit/:id/laboratory/:laboratoryId/action/:actionId/delete"
            element={<EditLaboratory />}
          />
          <Route
            path="/visit/:id/laboratory/:laboratoryId/edit/status/:status"
            element={<EditLaboratory />}
          />
          <Route
            path="/visit/:id/laboratory/:laboratoryId/status/:status"
            element={<Laboratory />}
          />
          <Route
            path="/visit/:id/laboratory/request"
            element={<AddRequest />}
          />

          {/* Route radiologi kunjungan */}
          <Route path="/visit/:id/radiology" element={<Radiology />} />
          <Route
            path="/visit/:id/radiology/add-request"
            element={<AddRequestRadiology />}
          />
          <Route
            path="/visit/:id/radiology/:radiologyId/add-action"
            element={<AddActionRadiology />}
          />
          <Route
            path="/visit/:id/radiology/:radiologyId"
            element={<EditRadiology />}
          />
          <Route
            path="/visit/:id/radiology/:radiologyId/status/:status"
            element={<Radiology />}
          />
          <Route
            path="/visit/:id/radiology/:radiologyId/detail-patient"
            element={<EditRadiology />}
          />
          <Route
            path="/visit/:id/radiology/:radiologyId/action/:actionId/delete"
            element={<EditRadiology />}
          />
          <Route
            path="/visit/:id/radiology/:radiologyId/edit/status/:status"
            element={<EditRadiology />}
          />
          {/* Resep */}
          {/* information is on route pharmacy */}

          <Route path="/visit/:id/receipt" element={<Receipt />} />
          {/* <Route
            path="/visit/:id/receipt/request"
            element={<AddRequestReceipt />}
          /> */}
          <Route
            path="/visit/:id/receipt/:receiptId/status/:status"
            element={<Receipt />}
          />
          {/* Racikan */}
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/edit/status/:status"
            element={<EditConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction"
            element={<EditConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/create"
            element={<EditConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/detail-patient"
            element={<EditConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/status/:status"
            element={<EditConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/:concoctionId"
            element={<DetailConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/:concoctionId/medicine/create"
            element={<DetailConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/:concoctionId/medicine/:medicineId/edit"
            element={<DetailConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/concoction/:concoctionId/medicine/:medicineId/delete"
            element={<DetailConcoction />}
          />

          <Route
            path="/visit/:id/receipt/:receiptId/concoction/:concoctionId/delete"
            element={<DetailConcoction />}
          />

          {/* Non Racikan */}
          <Route
            path="/visit/:id/receipt/:receiptId/non-concoction/edit/status/:status"
            element={<EditNonConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/non-concoction"
            element={<EditNonConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/non-concoction/status/:status"
            element={<EditNonConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/non-concoction/create"
            element={<EditNonConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/non-concoction/detail-patient"
            element={<EditNonConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/non-concoction/medicine/:medicineId/delete"
            element={<EditNonConcoction />}
          />
          <Route
            path="/visit/:id/receipt/:receiptId/non-concoction/medicine/:medicineId/edit"
            element={<EditNonConcoction />}
          />
          {/* Resep End */}

          {/* Route Rehab di Kunjungan Start */}
          <Route path="/visit/:id/rehab" element={<Rehab />} />
          <Route
            path="/visit/:id/rehab/:rehabId/status/:status"
            element={<Rehab />}
          />
          <Route path="/visit/:id/rehab/create" element={<CreateRehab />} />
          <Route path="/visit/:id/rehab/:rehabId" element={<EditRehab />} />
          <Route
            path="/visit/:id/rehab/:rehabId/action/create"
            element={<AddActionRehab />}
          />

          <Route
            path="/visit/:id/rehab/:rehabId/detail-patient"
            element={<EditRehab />}
          />
          <Route
            path="/visit/:id/rehab/:rehabId/action/:actionId/delete"
            element={<EditRehab />}
          />
          <Route
            path="/visit/:id/rehab/:rehabId/edit/status/:status"
            element={<EditRehab />}
          />
          {/* Route Rehab Kunjungan End */}

          {/* Route Rehab Start */}
          <Route path="/rehab-medic" element={<RehabMedic />} />
          <Route
            path="/rehab-medic/:rehabId/status/:status"
            element={<RehabMedic />}
          />
          <Route path="/rehab-medic/:rehabId" element={<DetailRehab />} />
          <Route
            path="/rehab-medic/:rehabId/detail-patient/:patientId"
            element={<DetailRehab />}
          />
          <Route
            path="/rehab-medic/:rehabId/action-status/:status"
            element={<DetailRehab />}
          />

          {/* Route Rehab End */}

          <Route
            path="/visit/:id/:type/patient-status/:status"
            element={<DynamicSoapType />}
          />

          {/* Route role */}
          <Route path="/role" element={<Role />} />
          <Route path="/role/create" element={<CreateRole />} />
          <Route path="/role/:id" element={<EditRole />} />
          <Route path="/role/:id/delete" element={<Role />} />

          {/* Route spesialis */}
          <Route path="/specialist" element={<Specialist />} />
          <Route path="/specialist/:id" element={<Specialist />} />
          <Route path="/specialist/:id/delete" element={<Specialist />} />

          {/* Route laboratorium semua user */}
          <Route path="/laboratory/request" element={<Lab />} />
          <Route
            path="/laboratory/request/:id/status/:status"
            element={<Lab />}
          />
          <Route
            path="/laboratory/request/:id/detail/status/:status"
            element={<DetailLab />}
          />
          <Route
            path="/laboratory/request/:id/detail"
            element={<DetailLab />}
          />
          <Route
            path="/laboratory/request/:id/detail/detail-patient/:patientId"
            element={<DetailLab />}
          />
          <Route path="/laboratory/result" element={<LaboratoryResult />} />
          <Route
            path="/laboratory/result/:resultId"
            element={<DetailLaboratoryResult />}
          />
          <Route
            path="/laboratory/result/:resultId/detail-patient"
            element={<DetailLaboratoryResult />}
          />

          {/* Radiology route start */}
          <Route path="/radiology" element={<RadiologyRequest />} />
          <Route
            path="/radiology/request/:requestId/status/:status"
            element={<RadiologyRequest />}
          />
          <Route
            path="/radiology/request/:requestId/action-status/:status"
            element={<RadiologyRequestDetail />}
          />
          <Route
            path="/radiology/request/:requestId"
            element={<RadiologyRequestDetail />}
          />
          <Route
            path="/radiology/request/:requestId/action/:actionId/edit"
            element={<RadiologyRequestEdit />}
          />
          <Route
            path="/radiology/request/:requestId/action/:actionId/edit/detail-patient"
            element={<RadiologyRequestEdit />}
          />
          <Route
            path="/radiology/request/:requestId/action/:actionId/edit/upload"
            element={<RadiologyRequestEdit />}
          />
          <Route
            path="/radiology/request/:requestId/action/:actionId/edit/help"
            element={<RadiologyRequestEdit />}
          />
          <Route
            path="/radiology/request/:requestId/action/:actionId/edit/attachment/:attachmentId/edit"
            element={<RadiologyRequestEdit />}
          />
          <Route
            path="/radiology/request/:requestId/action/:actionId/edit/attachment/:attachmentId/delete"
            element={<RadiologyRequestEdit />}
          />
          <Route
            path="/radiology/request/:requestId/edit/status/:status"
            element={<RadiologyRequestDetail />}
          />
          <Route
            path="/radiology/request/:requestId/detail-patient"
            element={<RadiologyRequestDetail />}
          />
          {/* Radiology route end  */}

          {/* DataMaster route start */}
          <Route
            path="/data-master/radiology/group"
            element={<DataMasterRadiologyGroup />}
          />
          <Route
            path="/data-master/radiology/group/:id"
            element={<DataMasterRadiologyGroup />}
          />
          <Route
            path="/data-master/radiology/group/:id/delete"
            element={<DataMasterRadiologyGroup />}
          />
          <Route
            path="/data-master/radiology/sub-group"
            element={<DataMasterRadiologySubGroup />}
          />
          <Route
            path="/data-master/radiology/sub-group/:id"
            element={<DataMasterRadiologySubGroup />}
          />
          <Route
            path="/data-master/radiology/sub-group/:id/delete"
            element={<DataMasterRadiologySubGroup />}
          />
          {/* DataMaster route end */}

          {/* pharmacy route */}
          <Route path="/pharmacy/request" element={<PharmacyRequest />} />
          <Route
            path="/pharmacy/request/receipt/:receiptId/status/:status"
            element={<PharmacyRequest />}
          />

          {/* Concoction in Pharmacy */}

          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction"
            element={<EditConcoction />}
          />

          {/* update status in toolbar */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/edit/status/:status"
            element={<EditConcoction />}
          />

          {/* create new concoction */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/create"
            element={<EditConcoction />}
          />

          {/* get detail patient in toolbar */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/detail-patient"
            element={<EditConcoction />}
          />

          {/* to detail concoction */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/:concoctionId"
            element={<DetailConcoction />}
          />

          {/* create new medicine in detail concoction */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/:concoctionId/medicine/create"
            element={<DetailConcoction />}
          />

          {/* edit medicine in detail concoction */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/:concoctionId/medicine/:medicineId/edit"
            element={<DetailConcoction />}
          />

          {/* delete medicine in detail concoction */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/:concoctionId/medicine/:medicineId/delete"
            element={<DetailConcoction />}
          />

          {/* delete concoction */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/concoction/:concoctionId/delete"
            element={<DetailConcoction />}
          />

          {/* Non Concoction */}

          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/non-concoction"
            element={<EditNonConcoction />}
          />

          {/* update status in toolbar concoction */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/non-concoction/edit/status/:status"
            element={<EditNonConcoction />}
          />

          {/* create new medicine  */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/non-concoction/create"
            element={<EditNonConcoction />}
          />

          {/* get detail patient in toolbar */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/non-concoction/detail-patient"
            element={<EditNonConcoction />}
          />

          {/* delete medicine */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/non-concoction/medicine/:medicineId/delete"
            element={<EditNonConcoction />}
          />

          {/* edit medicine */}
          <Route
            path="/pharmacy/request/:id/receipt/:receiptId/non-concoction/medicine/:medicineId/edit"
            element={<EditNonConcoction />}
          />
          {/* pharmacy route end */}

          {/* route icd  */}
          {/* Diagnosa Nine */}
          {/* route utama icd 9 */}
          <Route
            path="/visit/:id/icd/diagnosa-nine"
            element={<EditDiagnosaNine />}
          />
          <Route
            path="/visit/:id/icd/diagnosa-nine/detail-patient"
            element={<EditDiagnosaNine />}
          />

          {/* route delete icd 9 */}
          <Route
            path="/visit/:id/icd/diagnosa-nine/:diagnosaNineId/delete"
            element={<EditDiagnosaNine />}
          />

          {/* route create icd 9 */}
          <Route
            path="/visit/:id/icd/diagnosa-nine/create"
            element={<EditDiagnosaNine />}
          />

          {/* route icd 9 edit */}
          <Route
            path="/visit/:id/icd/diagnosa-nine/:diagnosaNineId/edit"
            element={<EditDiagnosaNine />}
          />

          {/* Diagnosa Ten */}
          {/* route utama icd 10 */}
          <Route
            path="/visit/:id/icd/diagnosa-ten"
            element={<EditDiagnosaTen />}
          />
          <Route
            path="/visit/:id/icd/diagnosa-ten/detail-patient"
            element={<EditDiagnosaTen />}
          />

          <Route
            path="/visit/:id/icd/diagnosa-ten/:diagnosaTenId/delete"
            element={<EditDiagnosaTen />}
          />
          <Route
            path="/visit/:id/icd/diagnosa-ten/:diagnosaTenId/edit"
            element={<EditDiagnosaTen />}
          />
          <Route
            path="/visit/:id/icd/diagnosa-ten/create"
            element={<EditDiagnosaTen />}
          />

          {/* route icd end */}

          <Route path="/user" element={<User />} />
          <Route path="/user/create" element={<CreateUser />} />
          <Route path="/user/:id" element={<EditUser />} />
          <Route path="/user/:id/delete" element={<User />} />
          <Route path="/assessment-setting" element={<AssessmentSetting />} />
          <Route
            path="/assessment-setting/:id"
            element={<EditAssessmentSetting />}
          />
          <Route
            path="/assessment-setting/:id/edit/:attributeId"
            element={<EditAssessmentSetting />}
          />
          <Route path="/log-activity" element={<LogActivity />} />
        </Route>
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
