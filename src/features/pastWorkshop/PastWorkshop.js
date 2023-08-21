import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'




const WorkshopItem = ({ workshopName, workshopID }) => {
    
    // global.workshopID = workshopID;
    const navigate = useNavigate()
    const handleEdit = () => {
        global.workshopID = workshopID;
        navigate(`/dash/pastWorkshop/${workshopID}`)
    }
    return(
    // global.workshopID = workshopID;
  <tr className="table__row user">
    <td onClick={handleEdit} className={`table__cell ` }>{workshopName}</td>
  </tr>
)};

const PastWorkshop = () => {

    console.log("global.userid")
    console.log(global.userid)
    

    const [workshops, setWorkshops] = useState([]);

    const getUserWorkshops = async () => {
      const options = {
          'method': 'POST',
          'url': `https://whiteboarddj-server.onrender.com/workshops/userworkshop`,
          'headers': {
              
          },
          data: {
              "userid": `${global.userid}`
          }
      };
      try {
          const result = await axios(options);
        setWorkshops(result.data);
      } catch (e) {
        console.log(e);
      }
    };

    useEffect(() => {
      if (global.userid === undefined){
        document.getElementById("Title").innerHTML = "Please authorize and log in to view your past workshops"
      }
      else{
        getUserWorkshops();
      }
    }, []);

    return (
      <section>
        {/* <button onClick={getUserWorkshops}>get workshops for you</button> */}
        <h1 id="Title">Workshops: </h1>

        <table className="table_workshop table--users">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th user__username">Workshop Name</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map(workshop => (
              <WorkshopItem key={workshop._id} workshopName={workshop.workshopname} workshopID={workshop._id}/>
              
            ))}
          </tbody>
        </table>

      </section>
    );
};

export default PastWorkshop;
