import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

// This DashLayout component is used to render the Header, the Outlet, and the Footer
const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className="dash-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}
export default DashLayout