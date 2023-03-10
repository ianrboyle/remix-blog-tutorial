import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Link } from "react-router-dom";
import { requireAdminUser } from "~/session.server";


export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json({})
}

export default function AdminIndexRoute() {
  return <p>
    <Link className="text-blue-600 underline" to="new">Create New Post</Link>
    </p>
}