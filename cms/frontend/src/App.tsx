import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import Services from './pages/Services';
import ServiceForm from './pages/ServiceForm';
import FAQ from './pages/FAQ';
import FAQForm from './pages/FAQForm';
import About from './pages/About';
import AboutForm from './pages/AboutForm';
import Contact from './pages/Contact';
import ContactForm from './pages/ContactForm';
import Tags from './pages/Tags';
import TagForm from './pages/TagForm';
import MediaLibrary from './pages/MediaLibrary';
import MediaUpload from './pages/MediaUpload';
import MediaEdit from './pages/MediaEdit';
import Settings from './pages/Settings';
import './App.css';
import { ThemeProvider } from './components/theme-provider';

const GlobalThemeStyles = () => (
  <style>{`
    :root {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%;
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --accent: 240 4.8% 95.9%;
      --accent-foreground: 240 5.9% 10%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 240 10% 3.9%;
      --radius: 0.5rem;
      --sidebar-background: 0 0% 98%;
      --sidebar-foreground: 240 5.3% 26.1%;
      --sidebar-primary: 240 5.9% 10%;
      --sidebar-primary-foreground: 0 0% 98%;
      --sidebar-accent: 240 4.8% 95.9%;
      --sidebar-accent-foreground: 240 5.9% 10%;
      --sidebar-border: 220 13% 91%;
      --sidebar-ring: 217.2 91.2% 59.8%;
    }
    .dark {
      --background: 240 10% 3.9%;
      --foreground: 0 0% 98%;
      --card: 240 10% 3.9%;
      --card-foreground: 0 0% 98%;
      --popover: 240 10% 3.9%;
      --popover-foreground: 0 0% 98%;
      --primary: 0 0% 98%;
      --primary-foreground: 240 5.9% 10%;
      --secondary: 240 3.7% 9%;
      --secondary-foreground: 0 0% 98%;
      --muted: 240 3.7% 9%;
      --muted-foreground: 240 5% 64.9%;
      --accent: 240 3.7% 9%;
      --accent-foreground: 0 0% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 3.7% 9%;
      --input: 240 3.7% 9%;
      --ring: 240 4.9% 83.9%;
      --sidebar-background: 240 10% 3.9%;
      --sidebar-foreground: 240 4.8% 95.9%;
      --sidebar-primary: 224.3 76.3% 48%;
      --sidebar-primary-foreground: 0 0% 100%;
      --sidebar-accent: 240 3.7% 15.9%;
      --sidebar-accent-foreground: 240 4.8% 95.9%;
      --sidebar-border: 240 3.7% 15.9%;
      --sidebar-ring: 217.2 91.2% 59.8%;
    }
    
    /* Base Styles */
    * {
      border-color: hsl(var(--border));
    }
    body {
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }

    /* Utility Class Overrides (Ensures theme applies even if Tailwind config is missing) */
    .bg-background { background-color: hsl(var(--background)); }
    .bg-card { background-color: hsl(var(--card)); }
    .bg-popover { background-color: hsl(var(--popover)); }
    .bg-primary { background-color: hsl(var(--primary)); }
    .bg-secondary { background-color: hsl(var(--secondary)); }
    .bg-muted { background-color: hsl(var(--muted)); }
    .bg-accent { background-color: hsl(var(--accent)); }
    .bg-destructive { background-color: hsl(var(--destructive)); }
    
    .text-foreground { color: hsl(var(--foreground)); }
    .text-card-foreground { color: hsl(var(--card-foreground)); }
    .text-popover-foreground { color: hsl(var(--popover-foreground)); }
    .text-primary-foreground { color: hsl(var(--primary-foreground)); }
    .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
    .text-muted-foreground { color: hsl(var(--muted-foreground)); }
    .text-accent-foreground { color: hsl(var(--accent-foreground)); }
    .text-destructive-foreground { color: hsl(var(--destructive-foreground)); }

    .border-input { border-color: hsl(var(--input)); }
    .border-primary { border-color: hsl(var(--primary)); }

    /* Glossy/Glassmorphism effect for headers/navbars in dark mode */
    .dark header, .dark nav, .dark .sticky {
      background-color: hsl(var(--background) / 0.75) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      border-bottom: 1px solid hsl(var(--border) / 0.4) !important;
    }

    /* Glossy Card Effect for User Profile */
    .dark .glossy-card,
    .dark aside .rounded-lg.border,
    .dark aside .rounded-md.border {
      background: linear-gradient(to bottom, #27272a, #09090b) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5) !important;
    }

    /* Smooth Transitions for Compact Mode */
    .py-6, .p-6, .px-6, .gap-6, nav a,
    .space-y-8 > :not([hidden]) ~ :not([hidden]),
    .space-y-6 > :not([hidden]) ~ :not([hidden]) {
      transition: padding 0.5s ease, margin 0.5s ease, gap 0.5s ease;
    }

    /* Compact Mode Overrides */
    .compact {
      --radius: 0.25rem;
    }

    .compact .py-6 {
      padding-top: 0.75rem !important;
      padding-bottom: 0.75rem !important;
    }

    .compact .p-6 {
      padding: 0.75rem !important;
    }

    .compact .px-6 {
      padding-left: 0.75rem !important;
      padding-right: 0.75rem !important;
    }

    .compact .space-y-8 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 1rem !important;
    }

    .compact .space-y-6 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 0.75rem !important;
    }

    .compact .gap-6 {
      gap: 0.75rem !important;
    }

    /* Compact Sidebar Links */
    .compact nav a {
      padding-top: 0.25rem !important;
      padding-bottom: 0.25rem !important;
    }
  `}</style>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <GlobalThemeStyles />
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
              <Route path="about" element={<About />} />
              <Route path="about/edit" element={<AboutForm />} />
              <Route path="contact" element={<Contact />} />
              <Route path="contact/edit" element={<ContactForm />} />
              <Route path="tags" element={<Tags />} />
              <Route path="tags/new" element={<TagForm />} />
              <Route path="tags/:id" element={<TagForm />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="media/upload" element={<MediaUpload />} />
              <Route path="media/:id" element={<MediaEdit />} />
              <Route path="settings" element={<Settings />} />
              <Route path="general-settings" element={<Settings />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
