"use server";

import { revalidatePath } from "next/cache";
import { directusLogin } from "./auth";
import {
  createItem,
  registerUser,
  deleteItem,
  readSingleton,
  readItems,
  readMe,
  updateItem,
  withToken,
} from "@directus/sdk";
import directus from "@/lib/directus";
import { redirect } from "next/navigation";
import { AUTH_USER, COOKIE_NAME } from "@/utils/constants";
import { cookies } from "next/headers";

export const deleteSession = async () => {
  cookies().delete(AUTH_USER);
  cookies().delete(COOKIE_NAME);
};

export const userSession = async () => {
  const cookieStore = cookies();
  let token = undefined;
  const cookie = cookieStore.get(COOKIE_NAME);
  if (cookie?.value) {
    token = JSON.parse(cookie?.value);
  }

  const session = {};
  if (token != undefined) {
    session.accessToken = token.data.access_token;
    session.refreshToken = token.data.refresh_token;
  }
  console.log({session})
  return session;
};

export const login = async (email, password) => {
  try {
    const user = await directusLogin({ email, password });
    if (user) {
      redirect("/");
    }
  } catch (err) {
    console.log(err);
    if (err.message.includes("Wrong credentials!")) {
      return { error: "Invalid username or password" };
    }
    throw err;
  }
};

export const getAuthUser = async (session) => {
  try {
    const userData = await directus.request(
      withToken(
        session.accessToken,
        readMe({
          fields: ["*"],
        })
      )
    );
    console.log({userData})
    return userData;
  } catch (err) {
    console.log()
    redirect("/login");
  }
};

export async function getProfile(slug) {
  try {
    const data = await directus.request(
      readSingleton('profiles', {
        fields: '*,location,location.*,tags.tags_id.*,profile_picture,additional_images.directus_files_id.id,additional_images.directus_files_id.description',
        filter: {
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
    console.log({slug})
    const data = await directus.request(
      readSingleton('events', {
        fields: '*,location,location.*,tags.tags_id.*,main_image,additional_images.*',
        filter: {
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


export async function getProfiles(filters) {
  try {
    let filterRules = {
      status: {
        _eq: 'published',
      }
    }
    if (filters?.tags?.length > 0)  {
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
                      _in: filters?.tags
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
    const data = await directus.request(
      readItems('profiles', {
        fields: '*,tags.tags_id.*,location.*',
        filter: filterRules
      })
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
    console.log(error.errors)
    return []
  }
}

export async function getEvents(filters) {
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
    if (filters?.tags?.length > 0)  {
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
                      _in: filters?.tags
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
    const data = await directus.request(
      readItems('events', {
        fields: '*,tags.tags_id.*',
        filter: filterRules
      })
    );

    if (data.error) {
      console.log(data.error)
      throw Error("No results returned for query")
    } else {
      const result = data.map(event => {
        return {
          ...event,
          tags: event.tags?.map(tag => ({ ...tag.tags_id })),
        }
      })
      return result
    }   
  } catch (error) {
    console.log({error})
    return []
  }
}

export async function getTags() {
  try {
    const data = await directus.request(
      readItems('tags', {
        fields: '*,translations.*',
      })
    );

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
  try {
    const result = await directus.request(createItem('profiles', data))
    console.log({result})
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function createEvent(data) {
  try {
    const result = await directus.request(createItem('events', data))
    console.log({result})
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function uploadImage(formData) {
  try {
    // const formData = new FormData();
    // formData.append('title', title)
    // formData.append('file', file, title);

    const result = await directus.request(uploadFiles(formData));
    return result
  } catch(error) {
    console.log({error})
    return error
  }
}

export async function getUserProfiles(session, user) {
  console.log(session)
  try {
    const data = await directus.request(
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
    const result = await directus.request(updateItem('profiles', profileId, data));
    return result
  } catch (error) {
    console.log(error)
    return error.errors
  }
}
