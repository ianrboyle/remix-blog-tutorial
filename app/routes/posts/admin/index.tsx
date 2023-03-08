import { Link } from "react-router-dom";

export default function AdminIndexRoute() {
  return <p>
    <Link className="text-blue-600 underline" to="new">Create New Post</Link>
    </p>
}