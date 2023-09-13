import { useNavigate, useLocation } from 'react-router-dom'

// This foorter component is used to navigate between pages
const DashFooter = () => {
    const navigate = useNavigate()

    // Navigate to Welcome page
    function gotoWelcome() {
        navigate('/')
    }

    // Navigate to Home page
    function gotoHome() {
        navigate('/dash')
    }

    const content = (
        <footer className="dash-footer">
            <button class="button-orange" onClick={gotoWelcome }>Welcome Page</button>
            <button class="button-orange" onClick={gotoHome} >Home Page</button>
        </footer>
    )
    return content
}
export default DashFooter