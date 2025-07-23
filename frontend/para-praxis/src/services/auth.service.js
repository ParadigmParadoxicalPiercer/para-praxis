export async function login({ email, password }) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("res", res);

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      console.log("contentType", contentType);
      // Check if the response is JSON
      if (contentType && contentType.includes("application/json")) {
        const error = await res.json();
        console.error("Login error response:", error);
        throw new Error(
          error.message || `Login failed with status ${res.status}`
        );
      } else {
        throw new Error(`Login failed with status ${res.status}`);
      }
    }

    return await res.json();
  } catch (error) {
    console.error("Login error:", error);
    // Handle network errors or JSON parsing errors
    if (error.message.includes("Unexpected end of JSON input")) {
      throw new Error("Server error - please try again later");
    }
    throw error;
  }
}

export async function register({ email, username, password, confirm }) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: username, // Backend expects 'name' field
        password,
        confirmPassword: confirm, // Backend expects 'confirmPassword' field
      }),
    });

    // Check if response is ok
    if (!res.ok) {
      // Try to parse error response
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await res.json();
        throw new Error(
          error.message || `Registration failed with status ${res.status}`
        );
      } else {
        throw new Error(`Registration failed with status ${res.status}`);
      }
    }

    return await res.json();
  } catch (error) {
    // Handle network errors or JSON parsing errors
    if (error.message.includes("Unexpected end of JSON input")) {
      throw new Error("Server error - please try again later");
    }
    throw error;
  }
}
