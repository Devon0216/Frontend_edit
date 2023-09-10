import axios from "axios";

export const getAccessToken = async (code) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/auth`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          code: code
        }
    };
    
    try {
        const result = await axios(options);
        console.log("hi")
        console.log(result);
        return result;
      } catch (e) {
          console.log(e);
          return JSON.parse(e.request.responseText).message
      }
  }

export const getAccessTokenContext = async (access_token) => {

    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v1/oauth-token`,
        'headers': {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json'
        },
        data: {

        }
    };

    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e;
    }
}

export const getBoards = async (access_token, teamId) => {
    const options = {
      'method': 'GET',
      'url': `https://api.miro.com/v2/boards?team_id=${teamId}`,
      'headers': {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      data: {
    
      }
    };
    
    try {
      const result = await axios(options);
      return result;
    } catch (e) {
         console.log("e.response.data");
         console.log(e.response.data);
         return e;
    }
}

export const createBoardAPI = async (access_token, teamId) => {
    const options = {
        'method': 'POST',
        'url': `https://api.miro.com/v2/boards`,
        'headers': {
          'Authorization': `Bearer ${access_token}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        data: {
          "teamId": `${teamId}`,
          "name": "WhiteboardDJ"
        }
    };
    
    try {
        const result = await axios(options);
        return result;
      } catch (e) {
          console.log(e);
          return JSON.parse(e.request.responseText).message
      }
  }