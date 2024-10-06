import './App.css'
import LandingPage from "./Pages/LandingPage.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./Components/Login.tsx";
import Register from "./Components/RegisterForm.tsx";
import Dashboard from "./Pages/Dashboard.tsx"
function App() {
    return (
        <>
            <div className={'main-container'}>
                <Router>
                    <Routes>
                        <Route path={'/*'} element={<LandingPage/>}/>
                        <Route path={'/auth/login'} Component={Login}/>
                        <Route path={'/auth/register'} Component={Register}/>
                        <Route path={'/dashboard/*'} Component={Dashboard}/>
                    </Routes>
                </Router>
            </div>
        </>
    )
}
export default App
