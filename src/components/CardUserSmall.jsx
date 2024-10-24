import { Link } from "react-router-dom";

function CardUserSmall(props) {
  return (
    <div className="card-user-small" style={{idth:"324px"}}>
      <Link to={`/user/profile/${props.username}`}>
        <div className="card-user-top">
          <div>
            <img
              src={props.profilePicture}
              alt={`${props.username}'s profile`}
              className="card-user-image"
            />
          </div>

          <div className="card-user-details">
            <h4 className="card-user-username">{props.username}</h4>
            {/* Solo mostrar la bio si existe */}
            {props.bio && <p className="card-user-bio">"{props.bio}"</p>}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardUserSmall;
