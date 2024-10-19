import { useState, useEffect } from "react";
import service from "../services/config.js";
import CardEvent from "./CardEvent.jsx"

function ListEvents(props) {
  const [allEvents, setAllEvents] = useState([])
  const {searchValue} = props

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
        {allEvents
        .filter((eachEvent) =>{
          return eachEvent.name.toLowerCase().includes(searchValue.toLowerCase())
        })
        .map((eachEvent)=>{
          return (
            <CardEvent key={eachEvent._id} allEvents={allEvents} {...eachEvent}/>
          )
        })}
    </div>
  )
}

export default ListEvents