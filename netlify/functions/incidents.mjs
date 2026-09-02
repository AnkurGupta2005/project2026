import { getStore } from "@netlify/blobs";

const STORE_NAME = "safe-yatri-incidents";
const KEY = "incidents";

const JSON_HEADERS = { "Content-Type": "application/json" };

function getIncidentStore() {
  return getStore(STORE_NAME);
}

async function readIncidents(store) {
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
  const store = getIncidentStore();

  // GET is intentionally open (no admin key) — both the visitor map
  // and the admin dashboard need to read the shared incident list.
  if (request.method === "GET") {
    const incidents = await readIncidents(store);
    return new Response(JSON.stringify(incidents), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  // POST is intentionally open (no admin key) — this is how visitors
  // submit incident reports from the public site.
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

    const description = (body.description || "").toString().trim();
    const zoneText = (body.zoneName || "").toString().trim();

    if (!description || !zoneText) {
      return new Response(
        JSON.stringify({ error: "zoneName and description are required" }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const incidents = await readIncidents(store);

    const newIncident = {
      id: Date.now(),
      zoneId: body.zoneId ?? null,
      zoneName: zoneText,
      type: (body.type || "Other").toString(),
      severity: (body.severity || "Medium").toString(),
      description,
      location: body.location ?? null,
      respondingFacility: body.respondingFacility ?? null,
      respondingFacilityType: body.respondingFacilityType ?? null,
      etaMinutes: body.etaMinutes ?? null,
      status: "OPEN",
      time: new Date().toISOString(),
    };

    incidents.unshift(newIncident);

    await store.setJSON(KEY, incidents);

    return new Response(JSON.stringify(incidents), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  // PATCH (admin only) — used to resolve/close an incident.
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
    const newStatus = (body.status || "CLOSED").toString();

    const incidents = await readIncidents(store);
    const target = incidents.find((i) => i.id === idToUpdate);

    if (!target) {
      return new Response(JSON.stringify({ error: "Incident not found" }), {
        status: 404,
        headers: JSON_HEADERS,
      });
    }

    target.status = newStatus;

    await store.setJSON(KEY, incidents);

    return new Response(JSON.stringify(incidents), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  // DELETE (admin only) — remove a single incident by id, or bulk-clear
  // by status (e.g. { "status": "CLOSED" }) to clear all resolved ones.
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

    const incidents = await readIncidents(store);

    let filtered;
    if (body.status) {
      filtered = incidents.filter((i) => i.status !== body.status);
    } else {
      filtered = incidents.filter((i) => i.id !== body.id);
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
  path: "/.netlify/functions/incidents",
};
