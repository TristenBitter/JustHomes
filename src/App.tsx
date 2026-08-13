import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import ApplyHub from "./pages/Apply/ApplyHub";
import ApplicationWizard from "./pages/Apply/ApplicationWizard";

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
          <Route
            path="/about"
            element={
              <ComingSoon
                title="About JustHomes"
                description="Learn more about our family-owned business and the Phoenix-area communities we serve."
              />
            }
          />
          <Route
            path="/contact"
            element={
              <ComingSoon
                title="Contact"
                description="Contact details for the JustHomes team are coming soon."
              />
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
