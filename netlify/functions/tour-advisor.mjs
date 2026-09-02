// AI Tour Advisor — judges whether now is a good time to visit a
// place, using ONLY the live crowd-prediction + weather numbers the
// front-end computed (see findTourPlace() in script.js). Requires an
// ANTHROPIC_API_KEY environment variable set in Netlify's site
// settings (Site configuration -> Environment variables). Without
// it, this returns 503 and the front-end quietly falls back to its
// own local heuristic so the feature still works.

const JSON_HEADERS = { "Content-Type": "application/json" };

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

function clampPlace(place) {
  return {
    name: (place?.name || "").toString().slice(0, 120),
    occupancy: typeof place?.occupancy === "number" ? place.occupancy : null,
    crowdStatus: (place?.crowdStatus || "").toString().slice(0, 40),
    crowdReason: (place?.crowdReason || "").toString().slice(0, 200),
  };
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: JSON_HEADERS,
    });
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

  const place = clampPlace(body.place);

  const weather = {
    risk: typeof body.weather?.risk === "number" ? body.weather.risk : null,
    text: (body.weather?.text || "").toString().slice(0, 80),
    temperature:
      typeof body.weather?.temperature === "number"
        ? body.weather.temperature
        : null,
  };

  const alternatives = Array.isArray(body.alternatives)
    ? body.alternatives.slice(0, 10).map((a) => ({
        name: (a?.name || "").toString().slice(0, 120),
        occupancy: typeof a?.occupancy === "number" ? a.occupancy : null,
        status: (a?.status || "").toString().slice(0, 40),
        distanceKm: typeof a?.distanceKm === "number" ? a.distanceKm : null,
      }))
    : [];

  if (!place.name) {
    return new Response(JSON.stringify({ error: "place.name is required" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Not configured yet — fail closed rather than guessing, so the
    // front-end's fallback heuristic kicks in instead.
    return new Response(
      JSON.stringify({ error: "AI advisor not configured" }),
      { status: 503, headers: JSON_HEADERS }
    );
  }

  const alternativesBlock = alternatives.length
    ? alternatives
        .map(
          (a) => `- ${a.name}: crowd ${a.occupancy}% (${a.status}), ${a.distanceKm}km away`
        )
        .join("\n")
    : "(none tracked)";

  const prompt = `You are a tourist safety advisor for Bhubaneswar, India. Judge ONLY from the live data below — do not use any outside knowledge about these places.

PLACE THE VISITOR WANTS TO GO: ${place.name}
- Current crowd occupancy: ${place.occupancy}% (status: ${place.crowdStatus})
- Crowd reason: ${place.crowdReason}

CURRENT WEATHER
- Condition: ${weather.text}
- Temperature: ${weather.temperature}°C
- Weather risk score: ${weather.risk}/100 (0 = perfectly safe, 100 = severe)

NEARBY ALTERNATIVE PLACES (only pick from this exact list, or none):
${alternativesBlock}

Decide if now is a good time to visit ${place.name}, combining crowd level and weather. Respond with ONLY a JSON object, no other text, no markdown fences, in exactly this shape:
{"verdict":"SAFE" | "CAUTION" | "UNSAFE","reason":"one short sentence a visitor can understand, mentioning both crowd and weather","alternative": "<exact name from the list above, or null>"}

Only suggest an alternative when verdict is "UNSAFE" or "CAUTION" AND a genuinely calmer option exists in the list. Otherwise set alternative to null.`;

  try {
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.log("Anthropic API error", aiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "AI advisor request failed" }),
        { status: 502, headers: JSON_HEADERS }
      );
    }

    const data = await aiResponse.json();

    const textBlock = (data.content || []).find((b) => b.type === "text");
    const rawText = textBlock ? textBlock.text : "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.log("Could not parse AI response:", rawText);
      return new Response(
        JSON.stringify({ error: "Could not parse AI response" }),
        { status: 502, headers: JSON_HEADERS }
      );
    }

    const verdict = ["SAFE", "CAUTION", "UNSAFE"].includes(
      (parsed.verdict || "").toString().toUpperCase()
    )
      ? parsed.verdict.toString().toUpperCase()
      : "CAUTION";

    const alternativeName =
      parsed.alternative && typeof parsed.alternative === "string"
        ? parsed.alternative
        : null;

    // Only trust an alternative that's actually in the list we sent —
    // guards against the model inventing a place name.
    const validAlternative =
      alternativeName &&
      alternatives.some(
        (a) => a.name.toLowerCase() === alternativeName.toLowerCase()
      )
        ? alternativeName
        : null;

    return new Response(
      JSON.stringify({
        verdict,
        reason: (parsed.reason || "").toString().slice(0, 400),
        alternative: validAlternative,
      }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch (error) {
    console.log("Tour advisor error", error);
    return new Response(
      JSON.stringify({ error: "AI advisor request failed" }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
};

export const config = {
  path: "/.netlify/functions/tour-advisor",
};
