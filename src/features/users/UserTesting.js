import axios from "axios";

const getUsers = async () => {
    const options = {
        'method': 'GET',
        'url': `https://whiteboard-server-7kf51co6i-devon0216.vercel.app//users`,
        'headers': {
            
        },
        data: {
          
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result);
        let users;
        for (let i = 0; i < result.data.length; i++){
            users = users + result.data[i]._id + ": " + result.data[i].username
        }
        document.getElementById("test").innerHTML = users
        return result;
      } catch (e) {
           console.log(e);
      }
}

const createUsers = async () => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboard-server-7kf51co6i-devon0216.vercel.app//users`,
        'headers': {
        },
        data: { 
            "username": "Test4", 
            "password": "Test4123",
            "roles": "testing role again"
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result);
        let users;
        for (let i = 0; i < result.data.length; i++){
            users = users + result.data[i]._id + ": " + result.data[i].username
        }
        document.getElementById("test").innerHTML = users
        return result;
      } catch (e) {
           console.log(e);
      }
}

const updateUsers = async () => {
    const options = {
        'method': 'PATCH',
        'url': `https://whiteboard-server-7kf51co6i-devon0216.vercel.app//users`,
        'headers': {
            
        },
        data: {
            "id": "64d933a72ab1304488742a56", 
            "username": "Test33333", 
            "roles": "testing role"

        }
    };
    
    try {
        const result = await axios(options);
        console.log(result);
        let users;
        for (let i = 0; i < result.data.length; i++){
            users = users + result.data[i]._id + ": " + result.data[i].username
        }
        document.getElementById("test").innerHTML = users
        return result;
      } catch (e) {
           console.log(e);
      }
}


const UserTesting = () => {

    

    let content = (
        <section>
            <h1>To view the notes content, authorize first with miro</h1>


            <button onClick={getUsers}>get users</button>
            <h1 id="test">Users: </h1>

            <button onClick={updateUsers}>update users</button>

            <button onClick={createUsers}>create users</button>

        </section>

    )

    return content
}

export default UserTesting