/**
 * Simple wrapper around fetch for NUI callbacks
 * @param {string} eventName - The resource event name
 * @param {any} data - Data to send back
 * @returns {Promise<any>} Response from the client Lua
 */
export async function fetchNui(eventName, data = {}) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  };

  // NUI relies on the parent window name for routing
  // Using a fallback for dev environment where GetParentResourceName might not exist
  const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : "cw-rep";

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, options);
    return await resp.json();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Env: Dev] Mocked NUI callback: ${eventName}`, data);
      return { status: "ok" };
    }
    throw error;
  }
}
