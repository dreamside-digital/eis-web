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
  uploadFiles,
  refresh
} from "@directus/sdk";
import { directus } from "@/services/directus";
import { COOKIE_NAME } from "@/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth"
import { options } from "@/lib/auth/options"


export async function getProfile(slug) {
  try {
    const data = await adminClient.request(
      readSingleton('profiles', {
        fields: '*,location,location.*,tags.tags_id.*,profile_picture,additional_images.directus_files_id.id,additional_images.directus_files_id.description,additional_images.directus_files_id.height,additional_images.directus_files_id.width',
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
    return null
  }
}

export async function getEvent(slug) {
  try {
    const data = await adminClient.request(
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



export async function getUserProfiles() {
  const session = await getServerSession(options)
  if (!session) return []

  try {
    const api = directus(session?.access_token)
    const data = await api.request(
      readItems('profiles', {
        fields: '*,tags.tags_id.*',
        filter: {
          user_created: {
            _eq: session.user.id
          }
        }
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
    console.log(error)
    return []
  }
}

export async function createProfile(data) {
  const session = await getServerSession()
  if (!session) throw new Error('Not authenticated')

  try {
    const profileData = { ...data, user_created: session.user.id }
    const result = await authedClient.request(createItem('profiles', profileData))
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function createEvent(data) {
  const session = await getServerSession()
  if (!session) throw new Error('Not authenticated')

  try {
    const eventData = { ...data, user_created: session.user.id }
    const result = await authedClient.request(createItem('events', eventData))
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function uploadImage(formData) {
  const session = await getServerSession()
  if (!session) throw new Error('Not authenticated')

  try {
    const result = await authedClient.request(uploadFiles(formData));
    return result
  } catch(error) {
    console.log({error})
    return error
  }
}

export async function updateProfile(profileId, data) {
  const session = await getServerSession()
  if (!session) throw new Error('Not authenticated')

  try {
    const result = await authedClient.request(updateItem('profiles', profileId, data));
    return result
  } catch (error) {
    console.log(error)
    return error.errors
  }
}
