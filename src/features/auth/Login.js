// import axios from "axios";
// import { useNavigate, Link } from 'react-router-dom'
// import React, { useState, useEffect } from "react";




// const Login = () => {



//     const getUserByNameAPI = async ( username) => {
//       const options = {
//           'method': 'POST',
//           'url': `https://whiteboarddj-server.onrender.com/users/useridByName`,
//           'headers': {
//               'content-type': 'application/json'
//           },
//           data: {
//             username: username
//           }
//       };
      
//       try {
//           console.log("username")
//           console.log(username)
//           const result = await axios(options);
//           console.log(result.data);
//           global.userid = result.data[0]._id
//           return result;
//         } catch (e) {
//               console.log(e);
//         }
//     }

//     const [userInfo, setuserInfo] = useState({ username: "", password: "" });
//       const handleOnChange = (e) => {
//         setuserInfo({ ...userInfo, [e.target.name]: e.target.value });
//       };
//       const navigate = useNavigate();

//       useEffect(() => {
//         async function autoLogin() {
//           const response = await fetch("https://whiteboarddj-server.onrender.com/autoLogin", {
//             method: "GET",
//             credentials: "include",
//           });
//           if (response.status === 200) {
//             navigate("/dash");
//           } else {
//             navigate("/login");
//           }
//         }
//         autoLogin();
//       }, []);

//       const submit = async (e) => {
//           e.preventDefault();
//           const username = document.getElementById("loginUsername").value
//             const password = document.getElementById("loginPassword").value

//             setuserInfo({ ...userInfo, ["username"]: username });
//             setuserInfo({ ...userInfo, ["password"]: password });

//         if (username.length > 0 && password.length > 0) {
//           const response = await fetch("https://whiteboarddj-server.onrender.com/", {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-type": "application/json",
//             },
//             body: JSON.stringify({
//                 username: userInfo.username,
//                 passsord: userInfo.password,
//             }),
//           });
//           if (response.status === 200) {

//             const response2 = await getUserByNameAPI(userInfo.username)
//             global.username= username
//             navigate("/dash");
//           }
//         }
//     };




//     const content = (
//         <section>
//             <header>
//                 <h1>
//                     <Link to="/">
//                         This is <span className="nowrap">Whiteboard by DJ!</span>
//                     </Link >
//                 </h1>
//             </header>
//             <main className="public__main">
//                 <h1>Log in:</h1>
//                 <br></br>
//                 <label for="username"><b>User Name:</b></label>
//                 <br></br>
//                 <input type="text" name="username" id="loginUsername" required onChange={(e) => handleOnChange(e)}/>
//                 <br/>

//                 <label for="password"><b>Password:</b></label>
//                 <br></br>
//                 <input type="password"  name="password" minLength="5" id="loginPassword" required onChange={(e) => handleOnChange(e)}/>
//                 <br></br>
//                 <br></br>

//                 <div>
//                     <button type="submit" onClick={submit}>Log in</button>
//                 </div>
//                 <p id="test"></p>
//             </main>
//         </section>


//     )

    
//     return content;

// }

// export default Login

