import { createDirectus, rest, authentication } from '@directus/sdk';

const directus = createDirectus(process.env.DIRECTUS_URL)
  .with(authentication("cookie", {credentials: "include", autoRefresh: true}))
  .with(rest({credentials: "include"}));

export default directus;