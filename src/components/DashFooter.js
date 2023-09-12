import { useNavigate, useLocation } from 'react-router-dom'

const DashFooter = () => {

    const navigate = useNavigate()

    function gotoWelcome() {
        navigate('/')
    }

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