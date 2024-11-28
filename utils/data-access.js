// "use server"

// import { 
//   createDirectus, 
//   authentication, 
//   rest, 
//   login, 
//   logout,
//   refresh, 
//   withToken, 
//   readMe, 
//   readItems,
//   readSingleton,
//   createItem,
//   updateItem,
//   uploadFiles,
// } from '@directus/sdk';
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import{ AUTH_USER, COOKIE_NAME } from "@/utils/constants"

// const directus = createDirectus(process.env.DIRECTUS_URL)
//   .with(authentication("cookie", {credentials: "include", autoRefresh: true}))
//   .with(rest({credentials: "include"}));

// let refreshTimeout = null

// export const setCredentials = async (sessionData) => {
//   const formattedData = JSON.stringify(sessionData)
//   cookies().set(COOKIE_NAME, formattedData)

//   // if (refreshTimeout) { 
//   //   clearTimeout(refreshTimeout)
//   // }

//   // refreshTimeout = setTimeout(async() => {
//   //   refreshTimeout = null;
//   //   await refreshSession()
//   // }, sessionData.expires - 3000)
// }

// export const createSession = async (email, password) => {
//   try {
//     const session = await directus.login(email, password)
//     // await setCredentials(session)
//     return { session }
//   } catch (err) {
//     return { errors: err.errors }
//   }
// } 

// // export const refreshSession = async () => {
// //   try {
// //     console.log("refresh token!!")
// //     const cookieStore = cookies();
// //     const cookie = cookieStore.get(COOKIE_NAME);
// //     const token = JSON.parse(cookie?.value);
// //     console.log({token})
// //     const session = await directus.request(refresh('json', token?.refresh_token))
// //     await setCredentials(session)
// //     return { session }
// //   } catch (err) {
// //     console.log("can't refresh token")
// //     console.log(err)
// //     return { errors: err.errors }
// //   }
// // } 

// export const refreshSession = async () => {
//   try {
//     const session = await directus.refresh()
//     return { session }
//   } catch (err) {
//     console.log("can't refresh token")
//     console.log(JSON.stringify(err))
//     return { errors: err.errors }
//   }
// } 


// export const deleteSession = async () => {
//   // const cookieStore = cookies();
//   // const cookie = cookieStore.get(COOKIE_NAME);
//   // const token = JSON.parse(cookie?.value);
//   // await directus.request(logout(token?.refresh_token, 'json'))
//   // if (refreshTimeout) {
//   //   clearTimeout(refreshTimeout);
//   // }
//   // cookies().delete(AUTH_USER);
//   // cookies().delete(COOKIE_NAME);
//   await directus.logout()
// };

// export const userSession = async () => {
//   try {
//     const cookieStore = cookies();
//     const cookie = cookieStore.get(COOKIE_NAME);
//     let session = JSON.parse(cookie?.value);

//     const user = {
//       accessToken: session?.access_token,
//       expiresAt: session?.expires_at,
//     }

//     return user;
//   } catch(err) {
//     console.log(err)
//     return { error: "Unauthorized" }
//   }
// };

// export const currentUser = async (accessToken) => {
//   try {
//     const user = await directus.request(
//       readMe({
//         fields: ['*'],
//       })
//     )
//     console.log({user})
//     return user
//   } catch(err) {
//     console.log(err)
//     return null
//   }
// }


// export async function getProfile(slug) {
//   try {
//     const data = await directus.request(
//       readSingleton('profiles', {
//         fields: '*,location,location.*,tags.tags_id.*,profile_picture,additional_images.directus_files_id.id,additional_images.directus_files_id.description',
//         filter: {
//           slug: {
//             _eq: slug
//           }
//         }
//       })
//     );

//     const result = data.map(profile => {
//       return {
//         ...profile,
//         tags: profile.tags.map(tag => ({ ...tag.tags_id })),
//       }
//     })

//     if (result[0]) {
//       return result[0]
//     } else {
//       throw Error("No results returned for query")
//     }   
//   } catch (error) {
//     console.log({error})
//     return []
//   }
// }

// export async function getEvent(slug) {
//   try {
//     console.log({slug})
//     const data = await directus.request(
//       readSingleton('events', {
//         fields: '*,location,location.*,tags.tags_id.*,main_image,additional_images.*',
//         filter: {
//           slug: {
//             _eq: slug
//           }
//         }
//       })
//     );

//     const result = data.map(event => {
//       return {
//         ...event,
//         tags: event.tags.map(tag => ({ ...tag.tags_id })),
//       }
//     })

//     if (result[0]) {
//       return result[0]
//     } else {
//       throw Error("No results returned for query")
//     }   
//   } catch (error) {
//     console.log({error})
//     return []
//   }
// }


// export async function getProfiles(filters) {
//   try {
//     let filterRules = {
//       status: {
//         _eq: 'published',
//       }
//     }
//     if (filters?.tags?.length > 0)  {
//       filterRules = {
//         _and: [
//           {
//             status: {
//               _eq: 'published',
//             },
//           },
//           {
//             tags: {
//               _or: [
//                 {
//                   tags_id: {
//                     id: {
//                       _in: filters?.tags
//                     }
//                   }
//                 }
//               ]
//             }
//           }
//         ]
//       }
//     }
//     const data = await directus.request(
//       readItems('profiles', {
//         fields: '*,tags.tags_id.*,location.*',
//         filter: filterRules
//       })
//     );

//     if (data.error) {
//       console.log(data.error.errors)
//       throw Error("No results returned for query")
//     } else {
//       const result = data.map(profile => {
//         return {
//           ...profile,
//           tags: profile.tags?.map(tag => ({ ...tag.tags_id })),
//         }
//       })
//       return result
//     }   
//   } catch (error) {
//     console.log(error.errors)
//     return []
//   }
// }

// export async function getEvents(filters) {
//   try {
//     let filterRules = {
//       _and: [
//         {
//           status: {
//             _eq: 'published',
//           },
//         }
//       ]
//     }
//     if (filters?.tags?.length > 0)  {
//       filterRules = {
//         _and: [
//           {
//             status: {
//               _eq: 'published',
//             },
//           },
//           {
//             tags: {
//               _or: [
//                 {
//                   tags_id: {
//                     id: {
//                       _in: filters?.tags
//                     }
//                   }
//                 }
//               ]
//             }
//           }
//         ]
//       }
//     }
//     const data = await directus.request(
//       readItems('events', {
//         fields: '*,tags.tags_id.*',
//         filter: filterRules
//       })
//     );

//     if (data.error) {
//       console.log(data.error)
//       throw Error("No results returned for query")
//     } else {
//       const result = data.map(event => {
//         return {
//           ...event,
//           tags: event.tags?.map(tag => ({ ...tag.tags_id })),
//         }
//       })
//       return result
//     }   
//   } catch (error) {
//     console.log({error})
//     return []
//   }
// }

// export async function getTags() {
//   try {
//     const data = await directus.request(
//       readItems('tags', {
//         fields: '*,translations.*',
//       })
//     );

//     if (data.error) {
//       console.log(data.error)
//       throw Error("No results returned for query")
//     } else {
//       return data
//     }   
//   } catch (error) {
//     console.log({error})
//     return []
//   }
// }



// export async function createProfile(data) {
//   try {
//     const result = await directus.request(createItem('profiles', data))
//     console.log({result})
//     return result
//   } catch(error) {
//     console.log(error.errors)
//     return {errors: error.errors}
//   }
// }

// export async function createEvent(data) {
//   try {
//     const result = await directus.request(createItem('events', data))
//     console.log({result})
//     return result
//   } catch(error) {
//     console.log(error.errors)
//     return {errors: error.errors}
//   }
// }

// export async function uploadImage(formData) {
//   try {
//     // const formData = new FormData();
//     // formData.append('title', title)
//     // formData.append('file', file, title);

//     const result = await directus.request(uploadFiles(formData));
//     return result
//   } catch(error) {
//     console.log({error})
//     return error
//   }
// }

// export async function getUserProfiles(user) {
//   try {
//     const data = await directus.request(
//       readItems('profiles', {
//         fields: '*,tags.tags_id.*',
//         filter: {
//           user_created: {
//             _eq: user.id
//           }
//         }
//       })
//     );

//     if (data.error) {
//       console.log(data.error)
//       throw Error("No results returned for query")
//     } else {
//       const result = data.map(profile => {
//         return {
//           ...profile,
//           tags: profile.tags?.map(tag => ({ ...tag.tags_id })),
//         }
//       })
//       return result
//     }   
//   } catch (error) {
//     console.log({error})
//     return []
//   }
// }

// export async function updateProfile(profileId, data) {
//   try {
//     const result = await directus.request(updateItem('profiles', profileId, data));
//     return result
//   } catch (error) {
//     console.log(error)
//     return error.errors
//   }
// }
