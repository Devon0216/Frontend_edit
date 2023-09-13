import axios from "axios";

// User function to create a new user with given username and Miro ID, by calling the server API
export const createUser = async (username, miroId) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/users`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          username: `${username}`,
          miroId: `${miroId}`
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return JSON.parse(e.request.responseText).message
    }
}

// User function to get a user with given username and Miro ID, by calling the server API
export const getUserByMiroId = async (username, miroId) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/users/username`,
        'headers': {
            
        },
        data: {
          "username": `${username}`,
          "miroId": `${miroId}`
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e
    }
}