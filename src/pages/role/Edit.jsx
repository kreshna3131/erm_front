import { ReactComponent as ExclamationMark } from "assets/icons/exclamation-mark.svg"
import { ReactComponent as Forbidden } from "assets/icons/forbidden.svg"
import { ReactComponent as GrayKeyIcon } from "assets/icons/gray-key.svg"
import axios from "axios"
import clsx from "clsx"
import { useFormik } from "formik"
import { capitalizeFirstLetter } from "helpers/string-helper"
import useBreadcrumb from "hooks/useBreadcrumb"
import useCheckPermission from "hooks/useCheckPermission"
import useSidebarActiveMenu from "hooks/useSidebarActiveMenu"
import { useEffect, useState } from "react"
import SweetAlert from "react-bootstrap-sweetalert"
import { useMutation, useQuery } from "react-query"
import { Link, useOutletContext, useParams } from "react-router-dom"
import { AccordionWhite } from "pages/visit/soap/assessment/Edit"
import {
  checkWithAssociations,
  Separator,
  toggleCheckAll,
  toggleCheckParent,
} from "./Create"
import { validationSchema } from "./Create"
import { Accordion } from "react-bootstrap"
import PrimaryLoader, { ErrorMessage } from "components/Loader"
import useDidMountEffect from "hooks/useDidMountEffect"

/**
 * Data menu breadcrumb
 */
const breadCrumbJson = {
  title: "Role",
  items: [
    { text: "Role", path: "/role" },
    {
      text: "Ubah",
      path: null,
    },
  ],
}

/**
 * Komponen utama edit role
 */
export default function Edit() {
  useBreadcrumb(breadCrumbJson)
  useSidebarActiveMenu("role")
  const [loading, setLoading] = useState(false)
  const { id: roleId } = useParams()
  const [submitStatus, setSubmitStatus] = useState({})
  const [initialValues, setInitialValues] = useState({
    name: "",
    note: "",
    permission: [],
  })
  const { user: loggedUser } = useOutletContext()
  useCheckPermission(loggedUser, "ubah role")

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
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
            setLoading(false)
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
            setLoading(false)
          },
        }
      )
    },
  })

  /** Mengupdate role yang dibuat */
  const { mutate } = useMutation(async (data) =>
    axios.post(`role/update/${roleId}`, data).then((res) => res.data)
  )

  /** Mengambil data list permission */
  const { data: permissionData, status: permissionStatus } = useQuery(
    "permissions",
    async () => {
      return axios.get("/role/list-permission").then((res) => res.data)
    }
  )

  /** Mengambil data detail role*/
  const { data: role, status: roleStatus } = useQuery(
    `role${roleId}`,
    async () => {
      return axios.get(`/role/edit/${roleId}`).then((res) => res.data)
    }
  )

  /** Mengubah data permission ke flat array */
  const [flattenPermissonData, setFlattenPermissonData] = useState([])
  useDidMountEffect(() => {
    let flatData = []
    Object.values(permissionData).forEach((group, groupKey) => {
      Object.values(group).forEach((subGroup, subGroupKey) => {
        flatData = [...flatData, ...subGroup]

        if (
          groupKey === Object.values(permissionData).length - 1 &&
          subGroupKey === Object.values(group).length - 1
        ) {
          setFlattenPermissonData(flatData)
        }
      })
    })
  }, [permissionData])

  /** Menchecklist role dan asosiasinya */
  useDidMountEffect(() => {
    formik.values.permission.forEach((permissionName) => {
      const currPermission = flattenPermissonData.find(
        (permission) => permission.name === permissionName
      )
      if (![null, undefined].includes(currPermission)) {
        const parsedJSON = JSON.parse(currPermission?.associations)
        if (![null, undefined].includes(parsedJSON)) {
          parsedJSON.forEach((association) => {
            if (!formik.values.permission.includes(association)) {
              formik.setFieldValue("permission", [
                ...formik.values.permission,
                association,
              ])
            }
          })
        }
      }
    })
  }, [formik.values.permission])

  useEffect(() => {
    if (role) {
      setInitialValues({
        name: role.role.name,
        note: role.role.note,
        permission: role.role.permissions.map((permission) => permission.name),
      })
    }
  }, [role])

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

      <div className="post d-flex flex-column-fluid" id="kt_post">
        <div id="kt_content_container" className="container-fluid">
          <form
            className="form w-100"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="row">
              <div className="col-md-4">
                <div className="card mb-4">
                  {[permissionStatus, roleStatus].includes("loading") && (
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "364px",
                      }}
                    >
                      <PrimaryLoader />
                    </div>
                  )}
                  {[permissionStatus, roleStatus].includes("error") && (
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "364px",
                      }}
                    >
                      <ErrorMessage />
                    </div>
                  )}
                  {[permissionStatus, roleStatus].every(
                    (el) => el === "success"
                  ) && (
                    <div className="card-body p-7">
                      <h3 className="text-dark mb-8">Ubah Role</h3>
                      <div className="form-group mb-8">
                        <label
                          htmlFor="create_name"
                          className="form-label fs-6 fw-medium text-gray-700"
                        >
                          Nama Role
                        </label>
                        <input
                          id="create_name"
                          {...formik.getFieldProps("name")}
                          className={clsx(
                            "form-control form-control-solid",
                            {
                              "is-invalid":
                                formik.touched.name && formik.errors.name,
                            },
                            {
                              "is-valid":
                                formik.touched.name && !formik.errors.name,
                            }
                          )}
                          type="text"
                          name="name"
                          autoComplete="off"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <span className="invalid-feedback" type="invalid">
                            {formik.errors.name}
                          </span>
                        )}
                      </div>
                      <div className="form-group mb-8">
                        <label
                          htmlFor="create_note"
                          className="form-label fs-6 fw-medium text-gray-700"
                        >
                          Deskripsi Singkat <ExclamationMark />
                        </label>
                        <textarea
                          {...formik.getFieldProps("note")}
                          name="note"
                          id="create_note"
                          autoComplete="off"
                          rows={5}
                          className={clsx(
                            "form-control form-control-solid",
                            {
                              "is-invalid":
                                formik.touched.note && formik.errors.note,
                            },
                            {
                              "is-valid":
                                formik.touched.note && !formik.errors.note,
                            }
                          )}
                        ></textarea>
                        {formik.touched.note && formik.errors.note && (
                          <div className="invalid-feedback" type="invalid">
                            {formik.errors.note}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-8">
                {[permissionStatus, roleStatus].includes("loading") && (
                  <div className="card mb-7">
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "500px",
                      }}
                    >
                      <PrimaryLoader />
                    </div>
                  </div>
                )}
                {[permissionStatus, roleStatus].includes("error") && (
                  <div className="card mb-7">
                    <div
                      className="card-body p-7 d-flex justify-content-center align-items-center"
                      style={{
                        minHeight: "500px",
                      }}
                    >
                      <ErrorMessage />
                    </div>
                  </div>
                )}
                {[permissionStatus, roleStatus].every(
                  (el) => el === "success"
                ) && (
                  <>
                    {["1", "2"].includes(roleId) ? (
                      <div className="card mb-7">
                        <div className="card-body d-flex flex-column align-items-center">
                          <Forbidden />
                          <h1>Forbidden</h1>
                          <p className="text-center text-gray-600 w-md-50">
                            Anda tidak diperbolehkan mengubah permissions pada
                            role {role?.role?.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <AccordionWhite>
                        <Accordion className="mb-5" defaultActiveKey="0">
                          {permissionData.hasOwnProperty("general") && (
                            <Accordion.Item
                              eventKey="0"
                              className="bg-white mb-5"
                            >
                              <Accordion.Header>
                                <GrayKeyIcon className="me-3" />
                                <h5 className="text-gray-700 m-0">
                                  General permissions
                                </h5>
                              </Accordion.Header>
                              <Accordion.Body className="d-flex flex-wrap">
                                {Object.keys(permissionData.general)?.map(
                                  (subGroup, key) => {
                                    return (
                                      <div
                                        key={key}
                                        className="w-50 flex-shrink-0 mb-5"
                                      >
                                        <p className="text-gray-500 mb-5 fw-medium text-capitalize">
                                          {subGroup.toUpperCase()}
                                        </p>
                                        <div className="form-check form-check-solid form-check-custom form-check-solid form-check-inline mb-5">
                                          <input
                                            type="checkbox"
                                            id={subGroup.replaceAll(" ", "_")}
                                            onChange={() =>
                                              toggleCheckAll({
                                                group: subGroup,
                                                formik: formik,
                                              })
                                            }
                                            checked={permissionData.general[
                                              subGroup
                                            ].every((permission) =>
                                              formik.values.permission.includes(
                                                permission.name
                                              )
                                            )}
                                            className="form-check-input text-gray-600 me-5"
                                          />
                                          <label
                                            className="cursor-pointer text-gray-600"
                                            htmlFor={subGroup.replaceAll(
                                              " ",
                                              "_"
                                            )}
                                          >
                                            Terapkan Semua
                                          </label>
                                        </div>
                                        {permissionData.general[subGroup].map(
                                          (permission, key) => (
                                            <div
                                              key={key}
                                              className="form-check form-check-solid form-check-custom form-check-solid form-check-inline ms-10 mb-5"
                                            >
                                              <input
                                                name="permission[]"
                                                value={permission.name}
                                                type="checkbox"
                                                id={`${permission.name.replaceAll(
                                                  " ",
                                                  "_"
                                                )}`}
                                                data-group={permission.group}
                                                className="form-check-input text-gray-600 me-5"
                                                onChange={(event) => {
                                                  checkWithAssociations({
                                                    event: event,
                                                    associations:
                                                      permission.associations,
                                                    formik,
                                                  })
                                                  toggleCheckParent(
                                                    permission.group
                                                  )
                                                }}
                                                checked={formik.values.permission.includes(
                                                  permission.name
                                                )}
                                              />
                                              <label
                                                className="cursor-pointer text-gray-600"
                                                htmlFor={`${permission.name.replaceAll(
                                                  " ",
                                                  "_"
                                                )}`}
                                              >
                                                {capitalizeFirstLetter(
                                                  permission.name
                                                )}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )
                                  }
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          )}
                          {permissionData.hasOwnProperty("assesment") && (
                            <Accordion.Item
                              eventKey="1"
                              className="bg-white mb-5"
                            >
                              <Accordion.Header>
                                <GrayKeyIcon className="me-3" />
                                <h5 className="text-gray-700 m-0">
                                  Assesment permissions
                                </h5>
                              </Accordion.Header>
                              <Accordion.Body>
                                {Object.keys(permissionData.assesment)?.map(
                                  (subGroup, key) => {
                                    return (
                                      <div
                                        key={key}
                                        className="flex-shrink-0 mb-10"
                                      >
                                        <p className="text-gray-500 mb-5 fw-semi-bold text-capitalize">
                                          {subGroup.toUpperCase()}
                                        </p>
                                        <div className="form-check form-check-solid form-check-custom form-check-solid form-check-inline mb-5">
                                          <input
                                            type="checkbox"
                                            id={subGroup.replaceAll(" ", "_")}
                                            onChange={() =>
                                              toggleCheckAll({
                                                group: subGroup,
                                                formik: formik,
                                              })
                                            }
                                            checked={permissionData.assesment[
                                              subGroup
                                            ].every((permission) =>
                                              formik.values.permission.includes(
                                                permission.name
                                              )
                                            )}
                                            className="form-check-input text-gray-600 me-5"
                                          />
                                          <label
                                            className="cursor-pointer text-gray-600"
                                            htmlFor={subGroup.replaceAll(
                                              " ",
                                              "_"
                                            )}
                                          >
                                            Terapkan Semua
                                          </label>
                                        </div>
                                        {permissionData.assesment[subGroup].map(
                                          (permission, key) => (
                                            <>
                                              <div
                                                key={key}
                                                className="form-check form-check-solid form-check-custom form-check-solid form-check-inline ms-10"
                                              >
                                                <input
                                                  name="permission[]"
                                                  value={permission.name}
                                                  type="checkbox"
                                                  id={`${permission.name.replaceAll(
                                                    " ",
                                                    "_"
                                                  )}`}
                                                  data-group={permission.group}
                                                  className="form-check-input text-gray-600 me-5"
                                                  onChange={(event) => {
                                                    checkWithAssociations({
                                                      event: event,
                                                      associations:
                                                        permission.associations,
                                                      formik,
                                                    })
                                                    toggleCheckParent(
                                                      permission.group
                                                    )
                                                  }}
                                                  checked={formik.values.permission.includes(
                                                    permission.name
                                                  )}
                                                />
                                                <label
                                                  className="cursor-pointer text-gray-600"
                                                  htmlFor={`${permission.name.replaceAll(
                                                    " ",
                                                    "_"
                                                  )}`}
                                                >
                                                  {capitalizeFirstLetter(
                                                    permission.name
                                                  )}
                                                </label>
                                              </div>
                                              <Separator
                                                name={permission.name}
                                              />
                                            </>
                                          )
                                        )}
                                      </div>
                                    )
                                  }
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          )}
                          {permissionData.hasOwnProperty("request") && (
                            <Accordion.Item
                              eventKey="2"
                              className="bg-white mb-5"
                            >
                              <Accordion.Header>
                                <GrayKeyIcon className="me-3" />
                                <h5 className="text-gray-700 m-0">
                                  Request permissions
                                </h5>
                              </Accordion.Header>
                              <Accordion.Body>
                                {Object.keys(permissionData.request)?.map(
                                  (subGroup, key) => {
                                    return (
                                      <div
                                        key={key}
                                        className="flex-shrink-0 mb-10"
                                      >
                                        <p className="text-gray-500 mb-5 fw-semi-bold text-capitalize">
                                          {subGroup.toUpperCase()}
                                        </p>
                                        <div className="form-check form-check-solid form-check-custom form-check-solid form-check-inline mb-5">
                                          <input
                                            type="checkbox"
                                            id={subGroup.replaceAll(" ", "_")}
                                            onChange={() =>
                                              toggleCheckAll({
                                                group: subGroup,
                                                formik: formik,
                                              })
                                            }
                                            checked={permissionData.request[
                                              subGroup
                                            ].every((permission) =>
                                              formik.values.permission.includes(
                                                permission.name
                                              )
                                            )}
                                            className="form-check-input text-gray-600 me-5"
                                          />
                                          <label
                                            className="cursor-pointer text-gray-600"
                                            htmlFor={subGroup.replaceAll(
                                              " ",
                                              "_"
                                            )}
                                          >
                                            Terapkan Semua
                                          </label>
                                        </div>
                                        {permissionData.request[subGroup].map(
                                          (permission, key) => (
                                            <div
                                              key={key}
                                              className="form-check form-check-solid form-check-custom form-check-solid form-check-inline ms-10 mb-5"
                                            >
                                              <input
                                                name="permission[]"
                                                value={permission.name}
                                                type="checkbox"
                                                id={`${permission.name.replaceAll(
                                                  " ",
                                                  "_"
                                                )}`}
                                                data-group={permission.group}
                                                className="form-check-input text-gray-600 me-5"
                                                onChange={(event) => {
                                                  checkWithAssociations({
                                                    event: event,
                                                    associations:
                                                      permission.associations,
                                                    formik,
                                                  })
                                                  toggleCheckParent(
                                                    permission.group
                                                  )
                                                }}
                                                checked={formik.values.permission.includes(
                                                  permission.name
                                                )}
                                              />
                                              <label
                                                className="cursor-pointer text-gray-600"
                                                htmlFor={`${permission.name.replaceAll(
                                                  " ",
                                                  "_"
                                                )}`}
                                              >
                                                {capitalizeFirstLetter(
                                                  permission.name
                                                )}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )
                                  }
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          )}
                          {permissionData.hasOwnProperty("icd") && (
                            <Accordion.Item
                              eventKey="3"
                              className="bg-white mb-5"
                            >
                              <Accordion.Header>
                                <GrayKeyIcon className="me-3" />
                                <h5 className="text-gray-700 m-0">
                                  ICD permissions
                                </h5>
                              </Accordion.Header>
                              <Accordion.Body>
                                {Object.keys(permissionData.icd)?.map(
                                  (subGroup, key) => {
                                    return (
                                      <div
                                        key={key}
                                        className="flex-shrink-0 mb-10"
                                      >
                                        <p className="text-gray-500 mb-5 fw-semi-bold text-capitalize">
                                          {subGroup.toUpperCase()}
                                        </p>
                                        <div className="form-check form-check-solid form-check-custom form-check-solid form-check-inline mb-5">
                                          <input
                                            type="checkbox"
                                            id={subGroup.replaceAll(" ", "_")}
                                            onChange={() =>
                                              toggleCheckAll({
                                                group: subGroup,
                                                formik: formik,
                                              })
                                            }
                                            checked={permissionData.icd[
                                              subGroup
                                            ].every((permission) =>
                                              formik.values.permission.includes(
                                                permission.name
                                              )
                                            )}
                                            className="form-check-input text-gray-600 me-5"
                                          />
                                          <label
                                            className="cursor-pointer text-gray-600"
                                            htmlFor={subGroup.replaceAll(
                                              " ",
                                              "_"
                                            )}
                                          >
                                            Terapkan Semua
                                          </label>
                                        </div>
                                        {permissionData.icd[subGroup].map(
                                          (permission, key) => (
                                            <div
                                              key={key}
                                              className="form-check form-check-solid form-check-custom form-check-solid form-check-inline ms-10 mb-5"
                                            >
                                              <input
                                                name="permission[]"
                                                value={permission.name}
                                                type="checkbox"
                                                id={`${permission.name.replaceAll(
                                                  " ",
                                                  "_"
                                                )}`}
                                                data-group={permission.group}
                                                className="form-check-input text-gray-600 me-5"
                                                onChange={(event) => {
                                                  checkWithAssociations({
                                                    event: event,
                                                    associations:
                                                      permission.associations,
                                                    formik,
                                                  })
                                                  toggleCheckParent(
                                                    permission.group
                                                  )
                                                }}
                                                checked={formik.values.permission.includes(
                                                  permission.name
                                                )}
                                              />
                                              <label
                                                className="cursor-pointer text-gray-600"
                                                htmlFor={`${permission.name.replaceAll(
                                                  " ",
                                                  "_"
                                                )}`}
                                              >
                                                {capitalizeFirstLetter(
                                                  permission.name
                                                )}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )
                                  }
                                )}
                              </Accordion.Body>
                            </Accordion.Item>
                          )}
                        </Accordion>
                      </AccordionWhite>
                    )}
                  </>
                )}
                <div className="d-flex justify-content-end">
                  <Link
                    to="/role"
                    type="button"
                    className="btn btn-white mb-5 me-4"
                  >
                    <span className="indicator-label fw-medium">Batal</span>
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary mb-5"
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!loading && (
                      <span className="indicator-label fw-medium">Simpan</span>
                    )}
                    {loading && (
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
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
