import { useState, useEffect } from "react";
import service from "../services/config.js";
import { useParams } from "react-router-dom";

function DetailsEvent() {

  const [event, setEvent] = useState("")
  const params = useParams()


  return (
    <div>DetailsEvent</div>
  )
}

export default DetailsEvent