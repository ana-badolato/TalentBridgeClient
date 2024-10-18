import { Link } from "react-router-dom"

function CardUser(props) {

  //console.log(props);

  //image, username, skills, bio
  return (
    <div>
    <Link to={`/user/${props._id}`}>
      <img src={props.profilePicture} alt="" />
      <p>{props.username}</p>
      <p>Skills:{props.skills}</p>
      <p>Bio:{props.bio}</p>
    </Link>
    </div>
  )
}

export default CardUser