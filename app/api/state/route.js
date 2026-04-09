import { put, list, del } from "@vercel/blob";

const BLOB_NAME = "posty-state.json";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) return Response.json({});
    const res = await fetch(blobs[0].url);
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({}, { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Delete old blob first
    const { blobs } = await list({ prefix: BLOB_NAME });
    for (const b of blobs) { await del(b.url); }
    // Write new one
    await put(BLOB_NAME, JSON.stringify(body), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
