import {Link} from "react-router-dom";

//icons
import evDate from "../assets/icons/evDate.svg"
import location from "../assets/icons/location.svg"

function CardEventSmall(props) {
  return (
    <div className="card-event-small">
      <Link to={`/event/${props._id}`}>
      <h4>{props.name}</h4>
      <hr className="hr-thin"/>
      <div style={{paddingBottom:"16px"}}>

      <div className="text-icon-element" style={{display:"flex", gap:"16px", width:"100%"}}>
        <img src={location} alt="" />
        <p>{props.address}</p>
      </div>
      <div className="text-icon-element" style={{display:"flex", gap:"16px", width:"100%"}}>
        <img src={evDate} alt="" /> 
        <p>{new Date(props.date).toLocaleDateString()}{" "}</p>

        </div>
      </div>
      </Link>
    </div>
  )
}

export default CardEventSmall