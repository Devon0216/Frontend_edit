// import { Link } from 'react-router-dom'
// import usernameTest from './Login'
import { useNavigate, Link } from 'react-router-dom'

const openURL = async () =>  {
    window.open(`http://localhost:3500/miro`, "_self")
}

const Welcome = () => {
    const navigate = useNavigate();
    async function logout() {
        const response = await fetch("http://localhost:3500/logout", {
        method: "GET",
        credentials: "include",
        });

        if (response.status === 200) {
            navigate("/");
        }
    }



    const content = (
        <section className="welcome">

            <div>
                <h1>Welcome!</h1>
                <br></br>
                <h1>Please click the authorize button to use the application. You will then need to log in with your account, and follow the instructions.</h1>
                <div>
                    <button onClick={openURL}>Authorize</button>
                </div>
                
            </div>

            
            <br></br>
            <br></br>


            {/* <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/users">View User Settings</Link></p> */}

            <p><Link to="/dash/authorize">View participants' notes and timer</Link></p>

            <p><Link to="/dash/pastWorkshop">Past Workshop</Link></p>

            {/* <div>
                <button onClick={logout}>Log out</button>
            </div> */}

        </section>

        
    )

    return content
}
export default Welcome