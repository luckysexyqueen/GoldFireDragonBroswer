import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const FIREDRAGON_UA = "Mozilla/9.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 FireDragon/135.0 stealth privatebrowsing incognito windowedfullscreen/complate";
const JAPAN_IP = "109.123.230.28";

const ALLOWED_ADULT_DOMAINS = [
  "pornhub.com", "xvideos.com", "xnxx.com", "xhamster.com",
  "onlyfans.com", "chaturbate.com", "bongacams.com", "stripchat.com",
  "youporn.com", "redtube.com", "spankbang.com", "eporner.com",
  "hitomi.la", "toon.kor", "toonkor", "hiyobi.me", "nhentai.net"
];

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  let target = url.searchParams.get("url") || req.headers.get("X-Target-URL");

  if (!target) {
    return new Response(JSON.stringify({ error: "URL이 필요합니다" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const targetUrl = new URL(target);
    const hostname = targetUrl.hostname.toLowerCase();

    const isAllowed = ALLOWED_ADULT_DOMAINS.some(d => hostname.includes(d));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: "허용되지 않은 사이트" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const proxyReq = new Request(target, {
      method: req.method,
      headers: {
        ...Object.fromEntries(req.headers),
        "User-Agent": FIREDRAGON_UA,
        "Accept-Language": "ko-KR,ko;q=0.9,ja;q=0.8",
        "X-Forwarded-For": JAPAN_IP,
        "X-Real-IP": JAPAN_IP,
        "Referer": targetUrl.origin,
      },
      body: req.body,
      redirect: "follow",
    });

    const response = await fetch(proxyReq);

    return new Response(response.body, {
      status: response.status,
      headers: { ...Object.fromEntries(response.headers), ...corsHeaders }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});