import { Link } from "react-router-dom"

function CardEvent(props) {
  return (
    <div>
    <Link to={`/event/${props._id}`}>
      <img src={props.posterImage} alt="" />
      <p>{props.name}</p>
      <p>{props.mainObjective}</p>
      <p>{props.date}</p>
      <p>{props.address}</p>
      <p>{props.owner}</p>
    </Link>
    </div>
  )
}

export default CardEvent