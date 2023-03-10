import type { ActionArgs, ActionFunction, LoaderFunction} from "@remix-run/node";
import { json} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createPost } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json({})
}

type ActionData = {
  title: null | string,
  slug: null | string,
  markdown: null | string
} | undefined;
export const action: ActionFunction = async ({ request} : ActionArgs) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  console.log(noteData)
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");
  if (
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof markdown !== "string" 
  )
  {
    throw new Error(`Form not submitted correctly.`);
  }
  // another way to do validation
  // invariant(typeof title === 'string', 'title must be a string')
  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const formFields = {title, slug, markdown}
  await createPost(formFields);

  return redirect("/posts/admin")
}
const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPost() {
  const errors = useActionData() as ActionData;

  const navigation = useNavigation();
  const isCreating = Boolean(
    navigation.state === "submitting"
  );
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">
              {errors.markdown}
            </em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}