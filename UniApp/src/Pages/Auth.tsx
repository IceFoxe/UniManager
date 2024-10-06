import Login from '../Components/Login.tsx'
import { Routes, Route} from 'react-router-dom'
import Register from "../Components/RegisterForm.tsx";
function App() {
    return (
            <Routes>
                <Route path={'/auth/login'} element={<Login/>}/>
                <Route path={'/auth/register'} Component={Register}/>
            </Routes>
    )
}
export default App
