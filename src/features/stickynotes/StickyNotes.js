import axios from "axios";

export const getStickyNotes = async (access_token, boardID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items?limit=50&type=sticky_note`,
        'headers': {
            'Authorization': `Bearer ${access_token}`
        },
        data: {
        }
    };
    
    try {
        const result = await axios(options);
        // console.log(result);
        return result;
      } catch (e) {
           console.log(e);
      }
}

export const saveStickyNotes = async (workshop, content) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/notes`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          workshop: workshop,
          content: content
        }
    };
    
    try {
        const result = await axios(options);
        return result;
      } catch (e) {
           console.log(e);
      }
}

export const deleteNotesByWorkshopAPI = async (workshop) => {
    const options = {
        'method': 'DELETE',
        'url': `https://whiteboarddj-server.onrender.com/notes/workshopNotes`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          workshop: workshop,
        }
    };
    
    try {
        const result = await axios(options);
        return result;
      } catch (e) {
           console.log(e);
      }
}

export const getFrames = async (access_token, boardID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items?limit=50&type=frame`,
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
        // console.log(result);
        return result;
      } catch (e) {
           console.log(e);
      }
  }

export const getFrameNotes = async (access_token, boardID, frameId) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items?parent_item_id=${frameId}`,
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
        // console.log(result);
        return result;
      } catch (e) {
           console.log(e);
      }
}

export const summariseAPI = async (notes, sensitivity) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/summarise`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            notes: notes,
            sensitivity: sensitivity
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

export const addSummaryAPI = async (workshopID, workshopSummary) => {
  const options = {
      'method': 'PATCH',
      'url': `https://whiteboarddj-server.onrender.com/workshops/workshopByName`,
      'headers': {
          'content-type': 'application/json'
      },
      data: {
          id: workshopID,
          workshopSummary: workshopSummary
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