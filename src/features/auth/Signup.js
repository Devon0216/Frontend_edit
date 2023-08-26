import axios from "axios";
import { useNavigate, Link } from 'react-router-dom'




const Signup = () => {
    const navigate = useNavigate()

    const createUser = async () => {
        const username = document.getElementById("signupUsername").value
        const password = document.getElementById("signupPassword").value
        const options = {
            'method': 'POST',
            'url': `https://whiteboard-server-7kf51co6i-devon0216.vercel.app//users`,
            'headers': {
            },
            data: { 
                "username": `${username}`,
              "password": `${password}`
            }
        };
        
        try {
            const result = await axios(options);
            console.log(result);
            // let users;
            // for (let i = 0; i < result.data.length; i++){
            //     users = users + result.data[i]._id + ": " + result.data[i].username
            // }
            // document.getElementById("test").innerHTML = users
            navigate('/')
            return result;
          } catch (e) {
               console.log(e);
               document.getElementById("signupError").innerHTML = JSON.parse(e.request.responseText).message
          }
    }

    const content = (
        <section>
            <header>
                <h1>
                    <Link to="/">
                        <span className="nowrap">Whiteboard DJ</span>
                    </Link >
                </h1>
            </header>
            <main className="public__main">
                <h1>Sign up:</h1>
                <br></br>
                <label for="username"><b>User Name:</b></label>
                <br></br>
                <input type="text" name="username" id="signupUsername" required/>
                <br/>

                <label for="password"><b>Password:</b></label>
                <br></br>
                <input type="password"  name="password" minLength="5" id="signupPassword" required/>
                <br></br>
                <br></br>

                <div>
                    <button type="submit" onClick={createUser}>Sign Up</button>
                </div>
                <p id="signupError"></p>
            </main>
        </section>


    )

    
    return content;

}

export default Signup