import { useNavigate, Link } from 'react-router-dom'

const Public = () => {

    const navigate = useNavigate();
    function gotoHome() {
        navigate('/dash')
    }

    function gotoSignup() {
        navigate('/signup')
    }

    const content = (
        
        <section className="public">
             <header>

                <h1>
                    <Link to="/dash">
                    <h1>Whiteboard DJ</h1>
                    </Link >
                </h1>
            </header>
            <main className="public__main">
                <h1 class="sectionHeading">Welcome</h1>
                <p>developed by Devon.</p>
                <p>The application is used for design thinking workshop facilitator to better manage the workshop. So you need to be able to use the application to better manage the workshop, such as viewing participant’s sticky notes, add agenda to the workshop, change time, summarise sticky notes and message other coaches in the workshop, without using the mobile Miro app.</p>
                <p className="public__addr">
                    Devon Yeung<br />
                    Computer Science Honours Project<br />
                    University of Cape Town<br />   
                </p>
                <br />

                {/* <button onClick={gotoLogin} >Log in</button> */}
                <button class="button-orange" onClick={gotoHome} >Go to Home</button>
                <br/>
                <br/>
                <button class="button-orange" onClick={gotoSignup }>Sign up</button>



            </main> 

            

        </section>

    )
    return content
}
export default Public