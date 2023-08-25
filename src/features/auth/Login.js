import axios from "axios";
import { useNavigate, Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";



// const test = async () => {
//     document.getElementById("test").textContent = document.getElementById("username").value
// }
// const usernameTest = () =>{
//     return document.getElementById("loginUsername").value
// } 



const Login = () => {

    // const navigate = useNavigate()
    

    // const getUserByName = async () => {
    //     const username = document.getElementById("loginUsername").value
    //     const password = document.getElementById("loginPassword").value
    //     console.log(username);
    //     console.log(password);
    //     const options = {
    //         'method': 'POST',
    //         'url': `https://whiteboarddj-server.onrender.com/users/username`,
    //         'headers': {
                
    //         },
    //         data: {
    //           "username": `${username}`,
    //           "password": `${password}`
    //         }
    //     };
        
    //     try {
    //         const result = await axios(options);
    //         console.log(result.data);
    //         // let user;
    //         // user =  "Welcome: " + result.data[0].username
    //         // document.getElementById("test").innerHTML = user

    //         // console.log("username")
    //         // console.log(document.getElementById("loginUsername").value)
    //         global.userid = result.data[0]._id
    //         global.username= result.data[0].username
    //         navigate('/dash')
    //         return result;
    //       } catch (e) {
    //             document.getElementById("test").innerHTML = "Your entered information is wrong"
    //             console.log(e);
    //       }
    // }


const getUserByNameAPI = async ( username) => {
  const options = {
      'method': 'POST',
      'url': `https://whiteboarddj-server.onrender.com/users/useridByName`,
      'headers': {
          'content-type': 'application/json'
      },
      data: {
        username: username
      }
  };
  
  try {
      console.log("username")
      console.log(username)
      const result = await axios(options);
      console.log(result.data);
      global.userid = result.data[0]._id
      return result;
    } catch (e) {
          console.log(e);
    }
}

const [userInfo, setuserInfo] = useState({ username: "", password: "" });
  const handleOnChange = (e) => {
    setuserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  useEffect(() => {
    async function autoLogin() {
      const response = await fetch("https://whiteboarddj-server.onrender.com/autoLogin", {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 200) {
        navigate("/dash");
      } else {
        navigate("/login");
      }
    }
    autoLogin();
  }, []);

  const submit = async (e) => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value
        const password = document.getElementById("loginPassword").value
        // console.log(username);
        // console.log(password);

        // console.log("userInfo");
        // console.log(userInfo);

        setuserInfo({ ...userInfo, ["username"]: username });
        setuserInfo({ ...userInfo, ["password"]: password });

        // console.log("userInfo after");
        // console.log(userInfo);

    if (username.length > 0 && password.length > 0) {
      const response = await fetch("https://whiteboarddj-server.onrender.com/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
            username: userInfo.username,
            passsord: userInfo.password,
        }),
      });
      if (response.status === 200) {
        // console.log("response")
        // console.log(response)

        // console.log("userInfo.username")
        // console.log(userInfo.username)

        const response2 = await getUserByNameAPI(userInfo.username)
        // console.log("response2")
        // console.log(response2)
        // global.userid = username
        global.username= username
        navigate("/dash");
      }
    }
  };




    const content = (
        <section>
            <header>
                <h1>
                    <Link to="/">
                        This is <span className="nowrap">Whiteboard by DJ!</span>
                    </Link >
                </h1>
            </header>
            <main className="public__main">
                <h1>Log in:</h1>
                <br></br>
                <label for="username"><b>User Name:</b></label>
                <br></br>
                <input type="text" name="username" id="loginUsername" required onChange={(e) => handleOnChange(e)}/>
                <br/>

                <label for="password"><b>Password:</b></label>
                <br></br>
                <input type="password"  name="password" minLength="5" id="loginPassword" required onChange={(e) => handleOnChange(e)}/>
                <br></br>
                <br></br>

                <div>
                    {/* <button type="submit" onClick={getUserByName}>Log in</button> */}
                    <button type="submit" onClick={submit}>Log in</button>
                </div>
                <p id="test"></p>
            </main>
        </section>


    )

    
    return content;

}

export default Login

