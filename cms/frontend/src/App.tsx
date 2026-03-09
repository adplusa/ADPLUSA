import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";
import Services from "./pages/Services";
import ServiceForm from "./pages/ServiceForm";
import FAQ from "./pages/FAQ";
import FAQForm from "./pages/FAQForm";
import About from "./pages/About";
import AboutForm from "./pages/AboutForm";
import HomepageForm from "./pages/HomepageForm";
import Contact from "./pages/Contact";
import ContactForm from "./pages/ContactForm";

import GeneralSettings from "./pages/GeneralSettings";
import Homepage from "./pages/Homepage";
import MainServicePageForm from "./pages/MainServicePageForm";
import ProjectsPageForm from "./pages/ProjectsPageForm";
import "./App.css";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="projects/new" element={<ProjectForm />} />
                        <Route path="projects/:id" element={<ProjectForm />} />
                        <Route path="services" element={<Services />} />
                        <Route path="services/new" element={<ServiceForm />} />
                        <Route path="services/:id" element={<ServiceForm />} />
                        <Route path="faq" element={<FAQ />} />
                        <Route path="faq/edit" element={<FAQForm />} />
                        <Route
                            path="homepage/edit"
                            element={<HomepageForm />}
                        />
                        <Route path="about" element={<About />} />
                        <Route path="about/edit" element={<AboutForm />} />
                        <Route path="homepage" element={<Homepage />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="contact/edit" element={<ContactForm />} />
                        <Route
                            path="general-settings"
                            element={<GeneralSettings />}
                        />
                        <Route
                            path="main-service-page"
                            element={<MainServicePageForm />}
                        />
                        <Route
                            path="projects-page"
                            element={<ProjectsPageForm />}
                        />
                    </Route>
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                    />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
