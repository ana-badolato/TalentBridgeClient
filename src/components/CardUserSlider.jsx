import { Link, useParams } from "react-router-dom";

function CardUserSlider(props) {

  const params = useParams()

  return (
    <div className="card-user">
      <div className="card-user-top">
        <div>

        <img src={props.profilePicture} alt={`${props.username}'s profile`} className="card-user-image" />
        </div>
        <div className="card-user-details">
          <h4 className="card-user-username">{props.username}</h4>

          {/* Solo mostrar la bio si existe */}
          {props.bio && <p className="card-user-bio">"{props.bio}"</p>}
            </div>
      </div>
    </div>
  )
}

export default CardUserSlider