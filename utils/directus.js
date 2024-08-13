"use server"

import { 
  createDirectus, 
  staticToken, 
  rest,
  readItems,
  readSingleton,
  createItem,
  uploadFiles
} from '@directus/sdk'

const directus = createDirectus(process.env.DIRECTUS_URL).with(rest()).with(staticToken(process.env.DIRECTUS_TOKEN));

export async function getProfile(slug) {
  try {
    const data = await directus.request(
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
    const data = await directus.request(
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

export async function getHomePageContent() {
  try {
    const data = await directus.request(
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
    const data = await directus.request(
      readSingleton('layout', {
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

export async function getFeatures(ids) {
  try {
    const data = await directus.request(
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

export async function getProfiles(filters) {
  try {
    const data = await directus.request(
      readItems('profiles', {
        fields: '*,tags.tags_id.*',
        filter: {
          _and: [
            {
              status: {
                _eq: 'published',
              },
            },
            {
              tags: {
                tags_id: {
                  id: {
                    _in: filters?.tags
                  }
                }
              }
            }
          ]
        }
      })
    );

    if (data.error) {
      console.log(data.error)
      throw Error("No results returned for query")
    } else {
      const result = data.map(profile => {
        return {
          ...profile,
          tags: profile.tags.map(tag => ({ ...tag.tags_id })),
        }
      })
      return result
    }   
  } catch (error) {
    console.log({error})
    return []
  }
}

export async function getEvents(filters) {
  try {
    const data = await directus.request(
      readItems('events', {
        fields: '*,tags.tags_id.*,additional_images.*',
        filter: {
          _and: [
            {
              status: {
                _eq: 'published',
              },
            },
            {
              tags: {
                tags_id: {
                  id: {
                    _in: filters?.tags
                  }
                }
              }
            }
          ]
        }
      })
    );

    if (data.error) {
      console.log(data.error)
      throw Error("No results returned for query")
    } else {
      const result = data.map(event => {
        return {
          ...event,
          tags: event.tags.map(tag => ({ ...tag.tags_id })),
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
        fields: '*',
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
    return result
  } catch(error) {
    console.log(error.errors)
    return error
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
