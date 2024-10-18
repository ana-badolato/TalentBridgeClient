import { Link } from "react-router-dom"

function CardProject(props) {
  return (
    <div>
      <h3>PROJECT</h3>
      <Link to={`/project/${props._id}`}>
      <img src={props.image} alt="" style={{width: "200px"}}/>

      <button>
        <img src="" alt="" />
        <p>Edit</p>
      </button>

      <button>
        <img src="" alt="" />
        <p>Delete</p>
      </button>

      <p>{props.title}</p>
      <p>{props.category}</p>
      <p>{props.description}</p>
      <img src={props.owner.profilePicture} alt=""  style={{width:"64px"}}/>
      <p>Owner name: {props.owner.username}</p>
      </Link>
      <button>
        <img src="" alt="" />
        <p>Apply</p>
      </button>
    </div>
  )
}

export default CardProject