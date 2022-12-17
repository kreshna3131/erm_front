import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ForgotPassword from "../pages/auth/ForgotPassword"
import { Layout as AuthLayout } from "../pages/auth/Layout"
import Login from "../pages/auth/Login"
import ResetPassword from "../pages/auth/ResetPassword"
import NotFound from "../pages/errors/NotFound"

export default function PublicRoutes() {
  return (
    <BrowserRouter basename="">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
