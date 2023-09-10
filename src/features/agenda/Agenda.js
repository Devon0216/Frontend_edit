import axios from "axios";

export const createTimerAPI = async (access_token, boardID, content) => {
    const options = {
        'method': 'POST',
        'url': `https://api.miro.com/v2/boards/${boardID}/texts`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data: {
            "data": {
                "content": `${content}`
            },
            "style": {
                "fontSize": "300"
            }
        }
    };
    
    try {
        const result = await axios(options);
        // console.log(result.data.id);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}


export const getTimerAPI = async (access_token, boardID, itemID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items/${itemID}`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
        },
        data: {

        }
    };
    
    try {
        const result = await axios(options);
        // console.log(result.data.id);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

export const updateTimerAPI = async (access_token, boardID, itemID, content) => {
    const options = {
        'method': 'PATCH',
        'url': `https://api.miro.com/v2/boards/${boardID}/texts/${itemID}`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data: {
            "data": {
                "content": `${content}`
            },
            "style": {
                "fontSize": "300",
                "color": "#fa0505"
            }
        }
    };
    
    try {
        const result = await axios(options);
        // console.log(result.data.id);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

export const addAgendaAPI = async (workshopID, workshopAgenda) => {
    const options = {
        'method': 'PATCH',
        'url': `https://whiteboarddj-server.onrender.com/workshops/userworkshop`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID,
            workshopAgenda: workshopAgenda
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}

export const deleteAgendaAPI = async (workshopID) => {
    const options = {
        'method': 'DELETE',
        'url': `https://whiteboarddj-server.onrender.com/workshops/userworkshop`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}