"use server";

import { revalidatePath } from "next/cache";
import {
  createItem,
  registerUser,
  deleteItem,
  readSingleton,
  readItems,
  readMe,
  updateItem,
  withToken,
  logout,
  refresh
} from "@directus/sdk";
import { authedClient, adminClient } from "@/lib/directus";
import { COOKIE_NAME } from "@/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const deleteSession = async () => {
  const session = await userSession()
  await authedClient.request(logout(session.refreshToken, 'json'));
  cookies().delete(COOKIE_NAME);
};

export const refreshSession = async () => {
  try {
    console.log("refreshing session")
    const oldSession = await userSession()
    const session = await authedClient.request(refresh('json', oldSession.refreshToken));
    const formattedData = JSON.stringify(session)
    cookies().set(COOKIE_NAME, formattedData)
    return { session }
  } catch(err) {
    console.log(err)
    redirect('/login')
  }
};

export const createSession = async(email, password) => {
  try {
    const session = await authedClient.login(email, password)
    const formattedData = JSON.stringify(session)
    cookies().set(COOKIE_NAME, formattedData)
    return { session }
  } catch (err) {
    return { errors: err.errors }
  }
} 

export const userSession = async () => {
  const cookieStore = cookies();
  let token = undefined;
  const cookie = cookieStore.get(COOKIE_NAME);
  if (cookie?.value) {
    token = JSON.parse(cookie?.value);
  }

  const session = {};
  if (token != undefined) {
    session.accessToken = token.access_token;
    session.refreshToken = token.refresh_token;
    session.expiresAt = token.expires_at;
  }
  return session;
};

export const currentUser = async (session) => {
  try {
    const userData = await authedClient.request(
      withToken(
        session.accessToken,
        readMe({
          fields: ["*"],
        })
      )
    );
    return userData;
  } catch (err) {
    console.log()
    return null
  }
};

export async function getProfile(slug) {
  try {
    const data = await adminClient.request(
      readSingleton('profiles', {
        fields: '*,location,location.*,tags.tags_id.*,profile_picture,additional_images.directus_files_id.id,additional_images.directus_files_id.description',
        filter: {
          status: {
            _eq: 'published',
          },
          slug: {
            _eq: slug
          }
        }
      })
    );

    const result = data.map(profile => {
      return {
        ...profile,
        tags: profile.tags.map(tag => ({ ...tag.tags_id })),
      }
    })

    if (result[0]) {
      return result[0]
    } else {
      throw Error("No results returned for query")
    }   
  } catch (error) {
    console.log({error})
    return []
  }
}

export async function getEvent(slug) {
  try {
    const data = await adminClient.request(
      readSingleton('events', {
        fields: '*,location,location.*,tags.tags_id.*,main_image,additional_images.*',
        filter: {
          status: {
            _eq: 'published',
          },
          slug: {
            _eq: slug
          }
        }
      })
    );

    const result = data.map(event => {
      return {
        ...event,
        tags: event.tags.map(tag => ({ ...tag.tags_id })),
      }
    })

    if (result[0]) {
      return result[0]
    } else {
      throw Error("No results returned for query")
    }   
  } catch (error) {
    console.log({error})
    return []
  }
}


export async function getProfiles(tags) {
  try {
    let filterRules = {
      status: {
        _eq: 'published',
      }
    }
    if (tags?.length > 0)  {
      filterRules = {
        _and: [
          {
            status: {
              _eq: 'published',
            },
          },
          {
            tags: {
              _or: [
                {
                  tags_id: {
                    id: {
                      _in: tags
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
    const data = await adminClient.request(
      readItems('profiles', {
        fields: '*,tags.tags_id.*',
        filter: filterRules
      })
    );

    const result = data.map(profile => {
      return {
        ...profile,
        tags: profile.tags?.map(tag => ({ ...tag.tags_id })),
      }
    })
    return result

  } catch (error) {
    console.log(error.errors)
    return []
  }
}

export async function getEvents(tags) {
  try {
    let filterRules = {
      _and: [
        {
          status: {
            _eq: 'published',
          },
        }
      ]
    }
    if (tags?.length > 0)  {
      filterRules = {
        _and: [
          {
            status: {
              _eq: 'published',
            },
          },
          {
            tags: {
              _or: [
                {
                  tags_id: {
                    id: {
                      _in: tags
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
    const data = await adminClient.request(
      readItems('events', {
        fields: '*,tags.tags_id.*',
        filter: filterRules
      })
    );

    const result = data.map(event => {
      return {
        ...event,
        tags: event.tags?.map(tag => ({ ...tag.tags_id })),
      }
    })
    return result
  } catch (error) {
    console.log({error})
    return []
  }
}

export async function getTags() {
  try {
    const data = await adminClient.request(
      readItems('tags', {
        fields: '*,translations.*',
      })
    )

    if (data.error) {
      console.log(data.error)
      throw Error("No results returned for query")
    } else {
      return data
    }   
  } catch (error) {
    console.log({error})
    return []
  }
}



export async function createProfile(data) {
  const session = await userSession()
  const user = await currentUser(session)
  try {
    const profileData = { ...data, user_created: user.id }
    const result = await authedClient.request(withToken(session.accessToken, createItem('profiles', profileData)))
    console.log({result})
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function createEvent(data) {
  const session = await userSession()
  const user = await currentUser(session)
  try {
    const eventData = { ...data, user_created: user.id }
    const result = await authedClient.request(withToken(session.accessToken, createItem('events', eventData)))
    console.log({result})
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function uploadImage(formData) {
  const session = await userSession()
  try {
    // const formData = new FormData();
    // formData.append('title', title)
    // formData.append('file', file, title);

    const result = await authedClient.request(withToken(session.accessToken, (uploadFiles(formData))));
    return result
  } catch(error) {
    console.log({error})
    return error
  }
}

export async function getUserProfiles() {
  const session = await userSession()
  const user = await currentUser(session)

  try {
    const data = await authedClient.request(
      withToken(
        session.accessToken,
        readItems('profiles', {
          fields: '*,tags.tags_id.*',
          filter: {
            user_created: {
              _eq: user.id
            }
          }
        })
      )
    );

    if (data.error) {
      console.log(data.error.errors)
      throw Error("No results returned for query")
    } else {
      const result = data.map(profile => {
        return {
          ...profile,
          tags: profile.tags?.map(tag => ({ ...tag.tags_id })),
        }
      })
      return result
    }   
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function updateProfile(profileId, data) {
  try {
    const session = await userSession()
    const result = await authedClient.request(withToken(session.accessToken, updateItem('profiles', profileId, data)));
    return result
  } catch (error) {
    console.log(error)
    return error.errors
  }
}
