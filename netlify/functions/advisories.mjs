import { getStore } from "@netlify/blobs";

const STORE_NAME = "safe-yatri-advisories";
const KEY = "advisories";

const JSON_HEADERS = { "Content-Type": "application/json" };

function getAdvisoryStore() {
  return getStore(STORE_NAME);
}

async function readAdvisories(store) {
  const data = await store.get(KEY, { type: "json" });
  return Array.isArray(data) ? data : [];
}

function isAuthorized(request) {
  const provided = request.headers.get("x-admin-key") || "";
  const expected = process.env.ADMIN_API_KEY || "";
  // If no ADMIN_API_KEY is configured on the site, refuse all writes
  // rather than silently accepting anything.
  return Boolean(expected) && provided === expected;
}

export default async (request) => {
  const store = getAdvisoryStore();

  if (request.method === "GET") {
    const advisories = await readAdvisories(store);
    return new Response(JSON.stringify(advisories), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  if (request.method === "POST") {
    if (!isAuthorized(request)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing admin key" }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const message = (body.message || "").toString().trim();
    const severity = (body.severity || "Info").toString();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const advisories = await readAdvisories(store);

    const newAdvisory = {
      id: Date.now(),
      message,
      severity,
      time: new Date().toISOString(),
    };

    advisories.unshift(newAdvisory);

    await store.setJSON(KEY, advisories);

    return new Response(JSON.stringify(advisories), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  if (request.method === "DELETE") {
    if (!isAuthorized(request)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing admin key" }),
        { status: 401, headers: JSON_HEADERS }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const idToDelete = body.id;
    const advisories = await readAdvisories(store);
    const filtered = advisories.filter((a) => a.id !== idToDelete);

    await store.setJSON(KEY, filtered);

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: JSON_HEADERS,
  });
};

export const config = {
  path: "/.netlify/functions/advisories",
};
