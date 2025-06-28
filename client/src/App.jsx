import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminLayout from "./Layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ClientManagement from "./pages/ClientManagement";
import DocumentManager from "./pages/DocumentManager";
import Inquiry from "./pages/Inquiry";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalProvider from "./provider/GlobalProvider";
import EditClient from "./pages/EditClient";
import DocumentDisplayPage from "./pages/DocumentDisplayPage";
import AddDocument from "./pages/AddDocument";
import ClientLayout from "./Layouts/ClientLayout";
import ClientDashboard from "./pages/ClientDashboard";
import MyDocuments from "./pages/MyDocuments";

function App() {
  return (
    <>
      <GlobalProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/services"
              element={
                <Layout>
                  <ServicesPage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route path="*" element={<NotFound />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="clients" element={<ClientManagement />} />
                <Route path="documents" element={<DocumentManager />} />
                <Route path="inquiry" element={<Inquiry />} />
                <Route path="register" element={<Register />} />
                <Route path="edit-client/:id" element={<EditClient />} />
                <Route
                  path="doc-client/:id"
                  element={<DocumentDisplayPage />}
                />
                <Route path="addDocument" element={<AddDocument />} />
              </Route>
            </Route>
            {/* user route */}
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="MyDocuments" element={<MyDocuments />} />
            </Route>
          </Routes>
        </Router>
      </GlobalProvider>
    </>
  );
}

export default App;
