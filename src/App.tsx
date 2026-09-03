import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import ApplyHub from "./pages/Apply/ApplyHub";
import ApplicationWizard from "./pages/Apply/ApplicationWizard";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminCallback from "./pages/Admin/AdminCallback";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminApplications from "./pages/Admin/AdminApplications";
import AdminApplicationDetail from "./pages/Admin/AdminApplicationDetail";
import ProtectedAdminRoute from "./pages/Admin/ProtectedAdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/properties"
            element={
              <ComingSoon
                title="Properties"
                description="Our full property listings and search are on the way. Check back soon, or start an application to get on our list."
              />
            }
          />
          <Route
            path="/map"
            element={
              <ComingSoon
                title="Property Map"
                description="An interactive map of available Phoenix-area properties is coming soon."
              />
            }
          />
          <Route path="/apply" element={<ApplyHub />} />
          <Route path="/apply/apartment" element={<ApplicationWizard applicationType="apartment" />} />
          <Route path="/apply/rent-to-own" element={<ApplicationWizard applicationType="rent-to-own" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/callback" element={<AdminCallback />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="applications" replace />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="applications/:id" element={<AdminApplicationDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
