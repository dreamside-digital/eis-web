"use server"

import { 
  createDirectus, 
  staticToken, 
  rest,
  readItems,
  readSingleton,
  createItem,
  updateItem,
  uploadFiles,
  registerUser,
  registerUserVerify,
} from '@directus/sdk'

import { createContact } from "./sendgrid"

const admin = createDirectus(process.env.DIRECTUS_URL).with(rest()).with(staticToken(process.env.DIRECTUS_TOKEN));

export async function getHomePageContent() {
  try {
    const data = await admin.request(
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
    const data = await admin.request(
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
    const data = await admin.request(
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
    const data = await admin.request(
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
    const data = await admin.request(
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
    const data = await admin.request(
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

export async function createUserAccount(userData)  {
  try {
    const { status, errors } = await admin.request(registerUser(
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
    const result = await admin.request(registerUserVerify(token));
    return result

  } catch (error) {
    return { errors: error.errors }
  }
}

