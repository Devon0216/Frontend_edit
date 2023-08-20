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
                    This is <span className="nowrap">Whiteboard by DJ!</span>
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
                <button onClick={gotoHome} >Go to Home</button>
                <br/>
                <br/>
                <button onClick={gotoSignup }>Sign up</button>


            </main>

        </section>

    )
    return content
}
export default Public