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

            <div>
                <h1 class="sectionHeading">Home</h1>
                <button class="button-orange" onClick={gotoWelcome }>Go back to welcome</button>
                <br></br>
                <br></br>
                <h1>Please click the authorize button to use the application. You will then need to log in with your account, and follow the instructions.</h1>

                <div>
                    <button class="button-orange" onClick={openURL}>Authorize</button>
                </div>
                
            </div>

            
            <br></br>
            <br></br>


            {/* <p><Link to="/dash/notes">View techNotes</Link></p> */}

            {/* <p><Link to="/dash/users">View User Settings</Link></p> */}

            {/* <p><Link to="/dash/authorize">View participants' notes and timer</Link></p>

            <p><Link to="/dash/pastWorkshop">Past Workshop</Link></p> */}

            <div>
                <button class="button-orange" onClick={gotoAuthorize} >View participants' notes and timer</button>
                <br/>
                <br/>
                <button class="button-orange" onClick={gotoPastWorkshop }>Past Workshop</button>
                <br/>
                <br/>
                
            </div>



            {/* <div>
                <button onClick={logout}>Log out</button>
            </div> */}

        </section>

        
    )

    return content
}
export default Welcome