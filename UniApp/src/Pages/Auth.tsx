import Login from '../Components/Login.tsx'
import { Routes, Route} from 'react-router-dom'
function App() {
    return (
            <Routes>
                <Route path={'/auth/login'} element={<Login/>}/>
            </Routes>
    )
}
export default App
