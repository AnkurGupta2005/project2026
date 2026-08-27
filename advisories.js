import { getStore } from "@netlify/blobs";

const KEY = "advisories.json";
const STORE_NAME = "safeyatri-advisories";

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "content-type": "application/json" }
    });
}

function isAuthorized(req) {
    const provided = req.headers.get("x-admin-key") || "";
    const expected = process.env.ADMIN_API_KEY || "";
    // If no key is configured on the server, refuse writes rather than
    // silently allowing anyone to post advisories.
    if (!expected) return false;
    return provided === expected;
}

export default async (req) => {
    const store = getStore(STORE_NAME);

    if (req.method === "GET") {
        const data = (await store.get(KEY, { type: "json" })) || [];
        return json(data);
    }

    if (req.method === "POST") {
        if (!isAuthorized(req)) {
            return json({ error: "Unauthorized" }, 401);
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return json({ error: "Invalid JSON body" }, 400);
        }

        const message = (body.message || "").toString().trim();
        const severity = (body.severity || "").toString().trim();

        if (!message || !severity) {
            return json({ error: "message and severity are required" }, 400);
        }

        const existing = (await store.get(KEY, { type: "json" })) || [];

        const advisory = {
            id: Date.now(),
            message,
            severity,
            time: new Date().toISOString()
        };

        existing.unshift(advisory);
        const trimmed = existing.slice(0, 20);

        await store.setJSON(KEY, trimmed);

        return json(trimmed, 201);
    }

    if (req.method === "DELETE") {
        if (!isAuthorized(req)) {
            return json({ error: "Unauthorized" }, 401);
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return json({ error: "Invalid JSON body" }, 400);
        }

        const id = Number(body.id);
        const existing = (await store.get(KEY, { type: "json" })) || [];
        const filtered = existing.filter((a) => a.id !== id);

        await store.setJSON(KEY, filtered);

        return json(filtered);
    }

    return json({ error: "Method not allowed" }, 405);
};

export const config = {
    path: "/api/advisories"
};
