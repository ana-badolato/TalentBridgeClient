import { Link } from "react-router-dom"

function CardEvent(props) {
  return (
    <div>
      <h3>EVENT</h3>
    <Link to={`/event/${props._id}`}>
      <img src={props.posterImage} alt=""  style={{width: "200px"}}/>
      <p>{props.name}</p>
      <p>{props.mainObjective}</p>
      <p>{props.date}</p>
      <p>{props.address}</p>
      <p>{props.owner.username}</p>
    </Link>
    </div>
  )
}

export default CardEvent