"use server";

import { revalidatePath } from "next/cache";
import {
  createItem,
  registerUser,
  registerUserVerify,
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
import {redirect} from 'next/navigation';


export async function getProfile(slug) {
  try {
    const session = await getServerSession(options)
    const api = directus(session?.access_token)
    const data = await api.request(
      readSingleton('profiles', {
        fields: `*,
        location,
        location.*,
        tags.tags_id.*,
        profile_picture,
        profile_picture.*,
        additional_images.directus_files_id.id,
        additional_images.directus_files_id.description,
        additional_images.directus_files_id.height,
        additional_images.directus_files_id.width,
        tarot_submissions.*,
        tarot_submissions.responses.*,
        tarot_submissions.responses.prompt.*,
        tarot_submissions.responses.prompt.translations.*`,
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
    return redirect("/")
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
    return redirect("/")
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

export async function getPrompts() {
  const api = directus()

  try {
    const data = await api.request(
      readItems('creative_prompts', {
        fields: '*,translations.*,category.id,category.translations.*,label.translations.*',
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
          },
          status: {
            _in: ['published', 'review', 'draft', 'private']
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

export async function createArtwork(data) {
  const session = await getServerSession(options)
  if (!session) throw new Error('Not authenticated')

  try {
    const api = directus(session?.access_token)
    const artworkData = { ...data, user_created: session.user.id }
    console.log('Creating artwork with data:', JSON.stringify(artworkData, null, 2))
    const result = await api.request(createItem('artworks', artworkData))
    return result
  } catch(error) {
    console.error('Directus createArtwork error:', error)
    if (error.errors) {
      console.log('Error details:', error.errors)
      return {errors: error.errors}
    } else {
      return {errors: [error.message || 'Unknown error occurred']}
    }
  }
}

export async function getUserArtworks() {
  const session = await getServerSession(options)
  if (!session) return []

  try {
    const api = directus(session?.access_token)
    const data = await api.request(
      readItems('artworks', {
        fields: '*,images.directus_files_id.*,themes.tags_id.*,profile_id.public_name',
        filter: {
          user_created: {
            _eq: session.user.id
          }
        },
        sort: ['-date_created']
      })
    );

    if (data.error) {
      console.log(data.error.errors)
      throw Error("No results returned for query")
    } else {
      const result = data.map(artwork => {
        return {
          ...artwork,
          images: artwork.images?.map(img => img.directus_files_id) || [],
          themes: artwork.themes?.map(theme => ({ ...theme.tags_id })) || [],
        }
      })
      return result
    }   
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function getArtwork(id) {
  const session = await getServerSession(options)
  if (!session) throw new Error('Not authenticated')

  try {
    const api = directus(session?.access_token)
    const data = await api.request(
      readItems('artworks', {
        fields: '*,images.directus_files_id.*,themes.tags_id.*,profile_id.public_name',
        filter: {
          id: {
            _eq: id
          },
          user_created: {
            _eq: session.user.id
          }
        }
      })
    );

    if (data && data.length > 0) {
      const artwork = data[0]
      return {
        ...artwork,
        images: artwork.images?.map(img => img.directus_files_id) || [],
        themes: artwork.themes?.map(theme => ({ ...theme.tags_id })) || [],
      }
    } else {
      throw Error("Artwork not found or access denied")
    }   
  } catch (error) {
    console.log({error})
    throw error
  }
}

export async function updateArtwork(artworkId, data) {
  const session = await getServerSession(options)
  if (!session) throw new Error('Not authenticated')
  
  try {
    const api = directus(session?.access_token)
    const result = await api.request(updateItem('artworks', artworkId, data));
    return result
  } catch (error) {
    console.error('Directus updateArtwork error:', error)
    if (error.errors) {
      return {errors: error.errors}
    } else {
      return {errors: [error.message || 'Unknown error occurred']}
    }
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
    revalidatePath(`/profiles/${result.slug}`)
    revalidatePath(`/account`)
    return result
  } catch (error) {
    console.log(error)
    return {errors: error.errors}
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

export async function getArtboxContent() {
  try {
    const api = directus()
    const data = await api.request(
      readSingleton('Artbox', {
        fields: '*,translations.*,translations.Mission.*,translations.Image_for_Artists.*,translations.Image_for_Subscribers.*'
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
    
    const fetchCollection = async (name, isItems = false) => {
      try {
        if (isItems) {
          return await api.request(readItems(name, { fields: '*,translations.*' }))
        } else {
          return await api.request(readSingleton(name, { fields: '*,translations.*' }))
        }
      } catch (error) {
        console.log(`Failed to fetch ${name}:`, error)
        return null
      }
    }

    const registrationForm = await fetchCollection('registration_form')
    const accountPage = await fetchCollection('account_page')
    const profileForm = await fetchCollection('profile_form')
    const eventForm = await fetchCollection('event_form')
    const artworkForm = await fetchCollection('artwork_form')
    const sharedMessages = await fetchCollection('shared_messages')
    const tags = await fetchCollection('tags', true)

    return {
      'registration_form': registrationForm,
      'profile_form': profileForm,
      'event_form': eventForm,
      'artwork_form': artworkForm,
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
  // Turnstile verification
  if (userData.turnstileToken) {
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: userData.turnstileToken,
      }),
    })
    const turnstileData = await turnstileRes.json()
    if (!turnstileData.success) {
      return {
        errors: [{ message: "Bot verification failed. Please try again." }]
      }
    }
  } else {
    return {
      errors: [{ message: "Bot verification is required. Please try again." }]
    }
  }

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
        // Add to newsletter subscribers in Directus (same as home page form)
        await createNewsletterSubscriber({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          language: userData.language,
          turnstileToken: userData.turnstileToken,
        })
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

export async function getFortune(id) {
  try {
    const session = await getServerSession(options)
    const api = directus(session?.access_token)
    const data = await api.request(
      readSingleton('tarot_submissions', {
        fields: '*',
        filter: {
          id: {
            _eq: id
          }
        }
      })
    );

    if (data[0]) {
      return data[0]
    } else {
      throw Error("No results returned for query")
    }
  } catch (error) {
    console.log({error})
    return redirect("/")
  }
}

export async function createNewsletterSubscriber(subscriberData) {
  // Honeypot check: if the hidden field was filled in, silently reject
  if (subscriberData._hp) {
    return { success: true, data: null }
  }

  // Time check: reject submissions faster than 3 seconds
  if (subscriberData._t && (Date.now() - subscriberData._t) < 3000) {
    return { success: true, data: null }
  }

  // Turnstile verification
  if (subscriberData.turnstileToken) {
    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: subscriberData.turnstileToken,
      }),
    })
    const turnstileData = await turnstileRes.json()
    if (!turnstileData.success) {
      return {
        success: false,
        errors: [{ message: "Bot verification failed. Please try again." }]
      }
    }
  } else {
    return {
      success: false,
      errors: [{ message: "Bot verification is required. Please try again." }]
    }
  }

  try {
    const api = directus(process.env.DIRECTUS_TOKEN)

    const data = {
      email: subscriberData.email,
      first_name: subscriberData.first_name,
      last_name: subscriberData.last_name,
      language: subscriberData.language,
      subscribed_date: new Date().toISOString(),
      source: 'homepage_form'
    }

    const result = await api.request(createItem('newsletter_subscribers', data))

    return { success: true, data: result }
  } catch (error) {
    console.log(error)

    // Check for duplicate email error
    if (error.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
      return {
        success: false,
        errors: [{ message: "This email is already subscribed to our newsletter." }]
      }
    }

    return {
      success: false,
      errors: error.errors || [{ message: "Unable to complete subscription. Please try again." }]
    }
  }
}
