import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardEvent from "./CardEvent.jsx"

function ListEvents() {
  const [allEvents, setAllEvents] = useState([])

  useEffect(()=>{
    getData()
  }, [])
  
  const getData = async () => {
    try {

      const response = await service.get("/event/")
      setAllEvents(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <p>Event page</p>
        {allEvents.map((eachEvent)=>{
          return (
            <CardEvent key={eachEvent._id} allEvents={allEvents} {...eachEvent}/>
          )
        })}
    </div>
  )
}

export default ListEvents