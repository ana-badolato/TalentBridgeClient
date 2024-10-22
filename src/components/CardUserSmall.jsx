import { Link, useParams } from "react-router-dom";

function CardUserSmall(props) {

  const params = useParams()

  return (
    <div className="card-user">
      <Link to={`/user/profile/${params.username}`}>
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
      </Link>
    </div>
  )
}

export default CardUserSmall