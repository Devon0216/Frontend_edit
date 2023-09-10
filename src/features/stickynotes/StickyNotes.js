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
        console.log(result);
        
        return result;
      } catch (e) {
           console.log(e);
      }
}