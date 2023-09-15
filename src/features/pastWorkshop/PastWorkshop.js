import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

// Function to create a table row with workshopname shown, for the given workshop name and workshop ID
const WorkshopItem = ({ workshopName, workshopID }) => {
    const navigate = useNavigate()
    const handleEdit = () => {
        global.workshopID = workshopID;
        navigate(`/dash/pastWorkshop/${workshopID}`)
    }
    return(
      <tr className="table__row user">
        <td onClick={handleEdit} className={`table__cell ` }>{workshopName}</td>
      </tr>
    )
};

// Function to get all the workshops created by the user in the past, for the given user ID
const PastWorkshop = () => {
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
        document.getElementById("Title").innerHTML = "Please authorize and create or join a workshop to view your past workshops"
      }
      else{
        getUserWorkshops();
      }
    }, []);

    return (
      <section>
        <h1 id="Title" className="sectionHeading">Workshops: </h1>

        {/* Create a table for the workshops created by the user in past, with rows indicating workshop names*/}
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
