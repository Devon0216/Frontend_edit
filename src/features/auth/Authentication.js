import axios from "axios";

// Authorization function to get a access token for using Miro REST apis with given code, by calling the server API
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
        return result;
    } catch (e) {
        return JSON.parse(e.request.responseText).message
    }
  }

// Authorization function to get a Miro's access token context with given access token, by calling the Miro API
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

// Authorization function to get a Miro team's boards with given Miro access token and Miro team ID, by calling the Miro API
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
         return e;
    }
}

// Authorization function to create a Miro board with given Miro access token and Miro team ID, by calling the Miro API
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
          return JSON.parse(e.request.responseText).message
      }
  }