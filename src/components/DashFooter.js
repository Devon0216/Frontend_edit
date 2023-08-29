import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'

const DashFooter = () => {

    const navigate = useNavigate()
    // const { pathname } = useLocation()

    // const onGoHomeClicked = () => navigate('/dash')

    function gotoWelcome() {
        navigate('/')
    }

    function gotoHome() {
        navigate('/dash')
    }

    // let goHomeButton = null
    // if (pathname !== '/dash') {
    //     goHomeButton = (
    //         <button
    //             className="dash-footer__button icon-button"
    //             title="Home"
    //             onClick={onGoHomeClicked}
    //         >
    //             <FontAwesomeIcon icon={faHouse} />
    //         </button>
    //     )
    // }

    const content = (
        <footer className="dash-footer">
            <button class="button-orange" onClick={gotoWelcome }>Welcome Page</button>
            <button class="button-orange" onClick={gotoHome} >Home Page</button>
        </footer>
    )
    return content
}
export default DashFooter