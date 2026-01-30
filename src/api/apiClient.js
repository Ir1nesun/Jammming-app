const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function apiFetch(path, { method = "GET", body, headers, signal } = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
    })

    const contentType = res.headers.get("content-type") || ""
    const payload = contentType.includes("application/json") ? await res.json() : await res.text()

    if(!res.ok){
        const msg = typeof payload === "object" && payload?.error ? payload.error : `HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.payload = payload;
        throw err;
    }

    return payload;
}