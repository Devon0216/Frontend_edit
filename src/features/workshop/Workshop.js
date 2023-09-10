import axios from "axios";

export const createWorkshopAPI = async (userID, workshopname) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/workshops`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            User: userID,
            workshopname: workshopname
        }
    };
    
    try {
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
           return JSON.parse(e.request.responseText).message
      }
}

export const getWorkshopByNameAPI = async ( workshopname) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/workshops/workshopByName`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            workshopname: workshopname
        }
    };
    
    try {
        console.log("workshopname")
        console.log(workshopname)
        const result = await axios(options);
        console.log(result.data);
        
        return result;
      } catch (e) {
           console.log(e);
           document.getElementById("workshopError").innerHTML = JSON.parse(e.request.responseText).message
           return JSON.parse(e.request.responseText).message
      }
}

export const updateWorkshopAPI = async (workshopID, userID, notes) => {
    const options = {
        'method': 'PATCH',
        'url': `https://whiteboarddj-server.onrender.com/workshops`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID,
            User: userID,
            Note: notes
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



