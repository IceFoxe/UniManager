import './PageStyles/Dashboard.css'
import {Link, Route, Routes} from "react-router-dom";
import ContentTasks from "../Components/ContentTasks.tsx";
import Overview from "../Components/Overview.tsx";
function Dashboard() {
    return (
        <>
            <div className={'dashboard-container'}>
                <div className={'navigation-container'}>
                    <div className={'logo-container'}>
                        <h1><Link className={'logo-link'} to={'/dashboard'}>TaskR</Link></h1>
                    </div>
                    <ul className={'nav-list'}>
                        <li><Link className={'nav-link'} to={'/dashboard/tasks'}>My Tasks</Link></li>
                        <li><Link className={'nav-link'} to={'/dashboard/settings'}>Settings</Link></li>
                        <li><Link className={'nav-link logout'} to={'/'}>Log out</Link></li>
                    </ul>
                </div>
                <div className={'content-container'}>
                    <Routes>
                        <Route path={'/tasks'} element={<ContentTasks/>}/>
                        <Route path={'/'} element={<Overview/>}/>
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default Dashboard
