import { useNavigate, Link } from 'react-router-dom'

// This Public component is used to render the Welcome page
const Public = () => {
    const navigate = useNavigate();

    // Navigate to Home page
    function gotoHome() {
        navigate('/dash')
    }

    const content = (
        <section className="public">
             <header className="dash-header">
                <div>
                    <Link to="/dash">
                        <h1 class="dash-header__title">Whiteboard DJ</h1>
                    </Link >
                </div>
            </header>
            <main className="public__main">
                <h1 class="sectionHeading">Welcome Page!</h1>
                <br></br>
                <h3>User story:</h3>
                <p>The application is used for design thinking workshop facilitator to better manage the workshop. So you should be able to use the application to better manage some key components of the workshop, such as viewing participant's sticky notes, add agenda to the workshop, change time, summarise sticky notes and message other coaches in the workshop, without using the mobile Miro app interface.</p>
                <br></br>
                <p>
                    Developed by Devon Yeung<br />
                    Computer Science Honours Project<br />
                    University of Cape Town<br />   
                </p>
                <br />
            </main> 

            <footer>
                <button class="button-orange" onClick={gotoHome} >Home Page</button>
            </footer>
        </section>
    )
    return content
}
export default Public