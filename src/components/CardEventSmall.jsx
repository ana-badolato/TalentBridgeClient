//icons
import evDate from "../assets/icons/evDate.svg"
import location from "../assets/icons/location.svg"

function CardEventSmall(props) {
  return (
    <div>
      <h4>{props.name}</h4>
        <img src={location} alt="" />
        <p>{props.address}</p>
        <img src={evDate} alt="" /> 
        {new Date(props.date).toLocaleDateString()}{" "}
    </div>
  )
}

export default CardEventSmall