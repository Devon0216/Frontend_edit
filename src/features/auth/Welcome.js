// import { Link } from 'react-router-dom'
// import usernameTest from './Login'
import { useNavigate, Link } from 'react-router-dom'

const openURL = async () =>  {
    window.open(`https://whiteboarddj-server.onrender.com/miro`, "_self")
}

const Welcome = () => {
    const navigate = useNavigate();
    async function logout() {
        const response = await fetch("https://whiteboarddj-server.onrender.com/logout", {
        method: "GET",
        credentials: "include",
        });

        if (response.status === 200) {
            navigate("/");
        }
    }

    function gotoAuthorize() {
        navigate('/dash/authorize')
    }

    function gotoPastWorkshop() {
        navigate('/dash/pastWorkshop')
    }

    function gotoWelcome() {
        navigate('/')
    }


    const content = (
        <section className="welcome">
            <main>
                <div>
                    <h1 class="sectionHeading">Home Page!</h1>
                    <p>This application is used to interact with Miro board, to be able to do this, please authorize through Miro first, so that you can use this application properly</p>
                    <button class="button-orange" onClick={openURL}>Authorize</button>                
                </div>

                {/* <p><Link to="/dash/notes">View techNotes</Link></p> */}

                {/* <p><Link to="/dash/users">View User Settings</Link></p> */}

                {/* <p><Link to="/dash/authorize">View participants' notes and timer</Link></p>

                <p><Link to="/dash/pastWorkshop">Past Workshop</Link></p> */}

                <div>
                    {/* <button class="button-orange" onClick={gotoAuthorize} >View participants' notes and timer</button> */}
                    <br/>
                    <br/>
                    <button class="button-orange" onClick={gotoPastWorkshop }>Past Workshop</button>
                    <br/>
                    <br/>
                    
                </div>
            </main>


            {/* <footer>
                <button class="button-orange" onClick={gotoWelcome }>Go to Welcome Page</button>
            </footer> */}

        </section>

        
    )

    return content
}
export default Welcome