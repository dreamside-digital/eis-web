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
import { getServerSession } from "next-auth"
import { options } from "@/lib/auth/options"
import { createContact } from "@/services/sendgrid";


export async function getProfile(slug) {
  try {
    const session = await getServerSession(options)
    const api = directus(session?.access_token)
    const data = await api.request(
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
    const session = await getServerSession(options)
    const api = directus(session?.access_token)
    const data = await api.request(
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
  const session = await getServerSession(options)
  const api = directus(session?.access_token)

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
    const data = await api.request(
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
  const session = await getServerSession(options)
  const api = directus(session?.access_token)

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
    const data = await api.request(
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
  const session = await getServerSession(options)
  const api = directus(session?.access_token)

  try {
    const data = await api.request(
      readItems('tags', {
        fields: '*,translations.*',
      })
    )

    console.log({data})

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
  const session = await getServerSession(options)
  if (!session) throw new Error('Not authenticated')

  try {
    const api = directus(session?.access_token)
    const profileData = { ...data, user_created: session.user.id }
    const result = await api.request(createItem('profiles', profileData))
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function createEvent(data) {
  const session = await getServerSession(options)
  if (!session) throw new Error('Not authenticated')

  try {
    const api = directus(session?.access_token)
    const eventData = { ...data, user_created: session.user.id }
    const result = await api.request(createItem('events', eventData))
    return result
  } catch(error) {
    console.log(error.errors)
    return {errors: error.errors}
  }
}

export async function uploadImage(formData) {
  const session = await getServerSession(options)
  if (!session) throw new Error('Not authenticated')

  try {
    const api = directus(session?.access_token)
    const result = await api.request(uploadFiles(formData));
    return result
  } catch(error) {
    console.log({error})
    return error
  }
}

export async function updateProfile(profileId, data) {
  const session = await getServerSession(options)
  if (!session) throw new Error('Not authenticated')

  try {
    const api = directus(session?.access_token)
    const result = await api.request(updateItem('profiles', profileId, data));
    return result
  } catch (error) {
    console.log(error)
    return error.errors
  }
}

export async function getHomePageContent() {
  try {
    const api = directus()
    const data = await api.request(
      readSingleton('home_page', {
        fields: '*,landing_section_background_image.*,origin_section_author_image.*,benefits_section_background_image.*,translations,translations.*,translations.key_features.features_id,translations.benefits.features_id'
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

export async function getLayoutContent() {
  try {
    const api = directus()
    const data = await api.request(
      readSingleton('layout', {
        fields: '*,translations.*,translations.navigation_dropdowns'
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

export async function getFeatures(ids) {
  try {
    const api = directus()
    const data = await api.request(
      readItems('features', {
        fields: '*, translations.*',
        filter: {
          id: {
            _in: ids,
          },
        }
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

export async function getCreditsContent() {
  try {
    const api = directus()
    const data = await api.request(
      readSingleton('credits_page', {
        fields: '*,translations.*'
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

export async function getContactContent() {
  try {
    const api = directus()
    const data = await api.request(
      readSingleton('contact_page', {
        fields: '*,translations.*'
      })
    );
    return data  
  } catch (error) {
    console.log({error})
    return []
  }
}

export async function getWorkshopContent() {
  try {
    const api = directus()
    const data = await api.request(
      readSingleton('workshop_page', {
        fields: '*,translations.*,translations.image_1.*,translations.image_2.*,translations.image_3.*,translations.image_4.*,translations.image_5.*'
      })
    );

    return data
  } catch (error) {
    console.log({error})
    return []
  }
}

export async function getVisionContent() {
  try {
    const api = directus()
    const data = await api.request(
      readSingleton('vision_page', {
        fields: '*,translations.*,translations.image_1.*,translations.image_2.*,translations.image_3.*,translations.image_4.*,translations.image_5.*'
      })
    );

    return data
  } catch (error) {
    console.log({error})
    return []
  }
}

export async function getPageTranslations() {
  try {
    const api = directus()
    const registrationForm = await api.request(
      readSingleton('registration_form', {
        fields: '*,translations.*'
      })
    );

    const accountPage = await api.request(
      readSingleton('account_page', {
        fields: '*,translations.*'
      })
    );

    const profileForm = await api.request(
      readSingleton('profile_form', {
        fields: '*,translations.*'
      })
    );

    const eventForm = await api.request(
      readSingleton('event_form', {
        fields: '*,translations.*'
      })
    );

    const sharedMessages = await api.request(
      readSingleton('shared_messages', {
        fields: '*,translations.*'
      })
    );

    const tags = await api.request(
      readItems('tags', {
        fields: '*,translations.*'
      })
    );

    return {
      'registration_form': registrationForm,
      'profile_form': profileForm,
      'event_form': eventForm,
      'account_page': accountPage,
      'tags': tags,
      'shared_messages': sharedMessages
    }

  } catch (error) {
    console.log({error})
    return {}
  }
}

export async function createUserAccount(userData)  {
  try {
    const api = directus(process.env.DIRECTUS_TOKEN)
    const { status, errors } = await api.request(registerUser(
      userData.email, 
      userData.password, 
      { 
        first_name: userData.first_name, 
        last_name: userData.last_name, 
        verification_url: process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_URL
      }
    ));

    if (status === 204) {
      if (userData.subscribe) {
        createContact(userData)
      }
      return { status }
    } else {
      throw Error("Unable to complete registration")
    }

  } catch (error) {
    console.log(error.errors)
    return { errors: error.errors }
  }
}

export async function verifyEmail(token) {
  try {
    const api = directus(process.env.DIRECTUS_TOKEN)
    const result = await api.request(registerUserVerify(token));
    return result

  } catch (error) {
    return { errors: error.errors }
  }
}

