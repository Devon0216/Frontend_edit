import { Link } from 'react-router-dom'


const DashHeader = () => {  
    const content = (
        <header className="dash-header">
            <div className="dash-header__container">
                <Link to="/dash">
                    <h1 className="dash-header__title">Whiteboard DJ</h1>
                </Link>
            </div>
        </header>
    )

    return content
}
export default DashHeader