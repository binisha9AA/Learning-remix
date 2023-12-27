import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { ActionFunctionArgs } from '@remix-run/node';
import { updateContact } from '../data';
import { getContact } from '../data';
import { redirect } from '@remix-run/node';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, 'Missing contactId param');
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ contact });
};
export const action = async ({
  context,
  params,
  request,
}: ActionFunctionArgs) => {
  //Using invariant again to check if the contactId param is present.
  invariant(params.contactId, 'Missing contactId param');
  //Extracting FormData from the `request` variable
  const formData = await request.formData();
  // Using Object.fromEntries method to read the key-value pairs of the FormData
  const updatedValues = Object.fromEntries(formData);
  // Sending the updated values to the updateContact method along with
  // the ID of the contact
  await updateContact(params.contactId, updatedValues);
  // Should always return null at the end
  return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <Form id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={contact.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}
