import { 
  createDirectus, 
  staticToken, 
  rest,
  readItems,
  readSingleton
} from '@directus/sdk'

const directus = createDirectus(process.env.DIRECTUS_URL).with(rest()).with(staticToken(process.env.DIRECTUS_TOKEN));

export async function getProfile(slug) {
  try {
    const data = await directus.request(
      readSingleton('profiles', {
        fields: '*,location,location.*,tags.tags_id.*,profile_picture.*',
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
        fields: '*,location,location.*,tags.tags_id.*,images,images.*',
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
