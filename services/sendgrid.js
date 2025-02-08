"use server"

import sendgrid from '@sendgrid/client'
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export async function createContact(userData)  {
  try {
    const data = {
      "list_ids": [process.env.SENDGRID_LIST_ID],
      "contacts": [
        {
          "first_name": userData.first_name,
          "last_name": userData.last_name,
          "email": userData.email,
          "custom_fields": {
            "language": userData.language,
          }
        }
      ]
    };

    const request = {
      url: `/v3/marketing/contacts`,
      method: 'PUT',
      body: data
    }

    const [response, body] = await sendgrid.request(request)

    console.log(response.statusCode);
    console.log(response.body);
    return response

  } catch (error) {
    console.log(error)
    return { errors: [error]}
  }
}