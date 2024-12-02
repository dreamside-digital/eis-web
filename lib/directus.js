import { createDirectus, rest, authentication, staticToken } from '@directus/sdk';

const authedClient = createDirectus(process.env.DIRECTUS_URL)
  .with(authentication("json", {credentials: "include", autoRefresh: true}))
  .with(rest());

const adminClient = createDirectus(process.env.DIRECTUS_URL).with(rest()).with(staticToken(process.env.DIRECTUS_TOKEN));

export {
  authedClient,
  adminClient
}