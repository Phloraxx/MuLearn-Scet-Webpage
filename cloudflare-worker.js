
export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const { muid } = await request.json();

      if (!muid) {
        return new Response(JSON.stringify({ error: "MuID is required" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Login to MuLearn to get access token
      // Note: In a real worker, store these in env variables (secrets)
      const loginResponse = await fetch("https://app.mulearn.org/api/v1/auth/user-authentication/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrMuid: env.ADMIN_USERNAME, // Set this in Cloudflare Worker Secrets
          password: env.ADMIN_PASSWORD,    // Set this in Cloudflare Worker Secrets
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Failed to authenticate with MuLearn");
      }

      const loginData = await loginResponse.json();
      const accessToken = loginData.response.accessToken;

      // Fetch user details using the MuID
      // Assuming there is an endpoint to search/get user by MuID or we use the profile endpoint if we can impersonate or search
      // Since the prompt says "this api will fetch details about mu-id", we'll assume a user search or profile lookup.
      // Based on common MuLearn API patterns, we might need to search.
      // However, for this example, I will implement a direct fetch if an endpoint exists, 
      // or a search if that's the standard way.
      // Let's assume we can use the admin privileges to search for the user.
      
      const userResponse = await fetch(`https://app.mulearn.org/api/v1/admin/user-management/user/${muid}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!userResponse.ok) {
         // If direct fetch fails, maybe try search or return not found
         return new Response(JSON.stringify({ valid: false, error: "User not found or API error" }), {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
      }

      const userData = await userResponse.json();

      // Return relevant user details
      return new Response(JSON.stringify({
        valid: true,
        data: userData.response // Adjust based on actual API response structure
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
