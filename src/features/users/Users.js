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
        console.log("create user result")
        console.log(result);
        return result;
      } catch (e) {
          console.log(e);
          return JSON.parse(e.request.responseText).message
      }
  }