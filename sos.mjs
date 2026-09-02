import { getStore } from "@netlify/blobs";

const STORE_NAME = "safe-yatri-sos";
const KEY = "sos";

const JSON_HEADERS = { "Content-Type": "application/json" };

function getSosStore() {
  return getStore(STORE_NAME);
}

async function readSos(store) {
  const data = await store.get(KEY, { type: "json" });
  return Array.isArray(data) ? data : [];
}

function isAuthorized(request) {
  const provided = request.headers.get("x-admin-key") || "";
  const expected = process.env.ADMIN_API_KEY || "";
  // If no ADMIN_API_KEY is configured on the site, refuse admin actions
  // rather than silently accepting anything.
  return Boolean(expected) && provided === expected;
}

export default async (request) => {
  const store = getSosStore();

  // GET is intentionally open (no admin key) — the Admin Dashboard's
  // "Emergency SOS Alerts" panel needs to read the shared list.
  if (request.method === "GET") {
    const alerts = await readSos(store);
    return new Response(JSON.stringify(alerts), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  // POST is intentionally open (no admin key) — this is how a visitor's
  // Instant SOS Help button reports an emergency.
  if (request.method === "POST") {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const lat = typeof body.lat === "number" ? body.lat : null;
    const lng = typeof body.lng === "number" ? body.lng : null;
    const accuracy = typeof body.accuracy === "number" ? body.accuracy : null;
    const message = (body.message || "Emergency SOS").toString().slice(0, 300);

    const alerts = await readSos(store);

    const newAlert = {
      id: Date.now(),
      lat,
      lng,
      accuracy,
      message,
      status: "OPEN",
      time: new Date().toISOString(),
    };

    alerts.unshift(newAlert);

    await store.setJSON(KEY, alerts);

    return new Response(JSON.stringify(alerts), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  // PATCH (admin only) — used to mark an SOS alert resolved.
  if (request.method === "PATCH") {
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

    const idToUpdate = body.id;
    const newStatus = (body.status || "RESOLVED").toString();

    const alerts = await readSos(store);
    const target = alerts.find((a) => a.id === idToUpdate);

    if (!target) {
      return new Response(JSON.stringify({ error: "SOS alert not found" }), {
        status: 404,
        headers: JSON_HEADERS,
      });
    }

    target.status = newStatus;

    await store.setJSON(KEY, alerts);

    return new Response(JSON.stringify(alerts), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  // DELETE (admin only) — remove a single alert by id, or bulk-clear
  // by status (e.g. { "status": "RESOLVED" }).
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

    const alerts = await readSos(store);

    let filtered;
    if (body.status) {
      filtered = alerts.filter((a) => a.status !== body.status);
    } else {
      filtered = alerts.filter((a) => a.id !== body.id);
    }

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
  path: "/.netlify/functions/sos",
};
