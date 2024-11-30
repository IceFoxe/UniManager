import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'
import DashboardLayout from './Pages/Dashboard.tsx'
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
        <Route
          path="/dashboard"
          element={
            <DashboardLayout />
          }
        />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;