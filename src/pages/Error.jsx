import { Link } from "react-router-dom"

function Error() {
  return (
    <div>
      <section>
        <h3>Oops, something went wrong!</h3>
      </section>

      <section>
        <p>Even the best projects face a few bumps.</p>
        <p>Let's get you back to discovering new talent and opportunities</p>
      </section>

      <section>
        <Link to="/">
          <button>Back to home</button>
        </Link>
      </section>

    </div>
  )
}

export default Error