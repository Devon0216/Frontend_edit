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
                <p>developed by Devon.</p>
                <address className="public__addr">
                    Devon Yeung<br />
                    Computer Science Honours Project<br />
                    University of Cape Town<br />   
                </address>
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