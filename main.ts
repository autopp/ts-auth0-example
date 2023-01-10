import { ManagementClient } from 'auth0'
import * as dotenv from 'dotenv'

const loadEnvs = <T extends string>(...names: T[]): { [k in T]: string }  => {
  const values = {} as { [k in T]: string }
  const notFounds: string[] = []
  names.forEach((name) => {
    const v = process.env[name]
    if (v !== undefined) {
      values[name] = v
    } else {
      notFounds.push(name)
    }
  })

  if (notFounds.length > 0) {
    throw new Error(`undefined environment variables: ${names.join(', ')}`)
  }

  return values
}

const main = async () => {
  dotenv.config()
  const { AUTH0_DOMAIN, AUTH0_API_CLIENT_ID, AUTH0_API_CLIENT_SECRET, AUTH0_CLIENT_ID, AUTH0_CALLBACK_URL } = loadEnvs(
    'AUTH0_DOMAIN', 'AUTH0_API_CLIENT_ID', 'AUTH0_API_CLIENT_SECRET', 'AUTH0_CLIENT_ID', 'AUTH0_CALLBACK_URL'
  )

  const auth0 = new ManagementClient({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_API_CLIENT_ID,
    clientSecret: AUTH0_API_CLIENT_SECRET,
    scope: 'read:clients update:clients'
  })

  const client = await auth0.getClient({client_id: AUTH0_CLIENT_ID})
  const callbacks = client.callbacks || []

  await auth0.updateClient({ client_id: AUTH0_CLIENT_ID }, { callbacks: [...callbacks, AUTH0_CALLBACK_URL] })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
