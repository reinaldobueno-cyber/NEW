const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function cors(origin) {
  const allowed = origin === "https://reinaldobueno-cyber.github.io" || origin?.startsWith("http://localhost:") || origin?.startsWith("http://127.0.0.1:");
  return {
    "access-control-allow-origin": allowed ? origin : "https://reinaldobueno-cyber.github.io",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, x-admin-password, x-title, x-character, x-map, x-description",
    "access-control-max-age": "86400",
    vary: "Origin"
  };
}

function response(data, status, origin) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...cors(origin) } });
}

async function authorized(request, env) {
  const supplied = request.headers.get("x-admin-password") || "";
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(supplied)),
    crypto.subtle.digest("SHA-256", encoder.encode(env.ADMIN_PASSWORD || ""))
  ]);
  return crypto.subtle.timingSafeEqual(left, right);
}

function clean(value, max = 120) {
  return String(value || "").trim().slice(0, max);
}

async function saveEntry(env, entry) {
  await env.VIDEOS.put(`entries/${entry.id}.json`, JSON.stringify(entry), {
    httpMetadata: { contentType: "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });

    try {
      if (request.method === "GET" && url.pathname === "/shortcuts") {
        const listed = await env.VIDEOS.list({ prefix: "entries/", limit: 500 });
        const entries = await Promise.all(listed.objects.map(async (item) => {
          const object = await env.VIDEOS.get(item.key);
          return object ? object.json() : null;
        }));
        return response(entries.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), 200, origin);
      }

      const videoMatch = url.pathname.match(/^\/videos\/([a-zA-Z0-9-]+)$/);
      if (request.method === "GET" && videoMatch) {
        const object = await env.VIDEOS.get(`videos/${videoMatch[1]}`);
        if (!object) return response({ error: "Vídeo não encontrado." }, 404, origin);
        const headers = new Headers(cors(origin));
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("cache-control", "public, max-age=3600");
        return new Response(object.body, { headers });
      }

      const uploadMatch = url.pathname.match(/^\/shortcuts\/([a-zA-Z0-9-]+)\/video$/);
      if (request.method === "PUT" && uploadMatch) {
        if (!(await authorized(request, env))) return response({ error: "Senha da Diretoria inválida." }, 401, origin);
        const title = clean(decodeURIComponent(request.headers.get("x-title") || ""));
        if (!title || !request.body) return response({ error: "Informe o nome e selecione o vídeo." }, 400, origin);
        const id = uploadMatch[1];
        const contentType = request.headers.get("content-type") || "video/mp4";
        if (!contentType.startsWith("video/")) return response({ error: "O arquivo precisa ser um vídeo." }, 415, origin);
        await env.VIDEOS.put(`videos/${id}`, request.body, { httpMetadata: { contentType } });
        const entry = {
          id, title, character: clean(decodeURIComponent(request.headers.get("x-character") || "GERAL"), 40),
          map: clean(decodeURIComponent(request.headers.get("x-map") || "OUTROS"), 60),
          description: clean(decodeURIComponent(request.headers.get("x-description") || ""), 300),
          type: "upload", videoUrl: `${url.origin}/videos/${id}`, createdAt: new Date().toISOString()
        };
        await saveEntry(env, entry);
        return response(entry, 201, origin);
      }

      const linkMatch = url.pathname.match(/^\/shortcuts\/([a-zA-Z0-9-]+)\/link$/);
      if (request.method === "POST" && linkMatch) {
        if (!(await authorized(request, env))) return response({ error: "Senha da Diretoria inválida." }, 401, origin);
        const body = await request.json();
        const title = clean(body.title); const videoUrl = clean(body.videoUrl, 500);
        if (!title || !/^https:\/\//i.test(videoUrl)) return response({ error: "Informe o nome e um link HTTPS válido." }, 400, origin);
        const entry = { id: linkMatch[1], title, character: clean(body.character || "GERAL", 40), map: clean(body.map || "OUTROS", 60), description: clean(body.description, 300), type: "link", videoUrl, createdAt: new Date().toISOString() };
        await saveEntry(env, entry);
        return response(entry, 201, origin);
      }

      const deleteMatch = url.pathname.match(/^\/shortcuts\/([a-zA-Z0-9-]+)$/);
      if (request.method === "DELETE" && deleteMatch) {
        if (!(await authorized(request, env))) return response({ error: "Senha da Diretoria inválida." }, 401, origin);
        const id = deleteMatch[1];
        await Promise.all([env.VIDEOS.delete(`entries/${id}.json`), env.VIDEOS.delete(`videos/${id}`)]);
        return response({ ok: true }, 200, origin);
      }

      return response({ service: "NEW Arena API", status: "online" }, 200, origin);
    } catch (error) {
      console.error(JSON.stringify({ event: "arena_api_error", message: error instanceof Error ? error.message : String(error) }));
      return response({ error: "Não foi possível concluir a operação." }, 500, origin);
    }
  }
};
