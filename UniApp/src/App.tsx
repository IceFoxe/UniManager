import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'
import DashboardLayout from './Pages/Dashboard.tsx'
import LandingPage from './Pages/LandingPage.tsx'
import { ProtectedRoute, setupAuthInterceptor } from './authUtils.tsx';
import RegisterForm from "./Components/RegisterForm.tsx";

// Setup axios interceptors
setupAuthInterceptor();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/register" element={<RegisterForm />} />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/panel_uzytkownika"
          element={
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
          }
        />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;