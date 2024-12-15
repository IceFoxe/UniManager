import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './Components/Login'
import DashboardLayout from './Pages/Dashboard.tsx'
import LandingPage from './Pages/LandingPage.tsx'
import {ProtectedRoute, setupAuthInterceptor} from './authUtils.tsx';
import {LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

setupAuthInterceptor();

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route
                        path="/panel_uzytkownika/*"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </LocalizationProvider>
    );
}

export default App;
