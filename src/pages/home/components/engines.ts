export const DEFAULT_ENGINE_ID = "firedragon_jp";

export const ENGINES = [
  {
    id: "firedragon_jp",
    name: "🐉 FireDragon JP",
    emoji: "🐉",
    badge: "JP Stealth",
    badgeColor: "bg-red-600",
    buildDirectUrl: (q: string) => {
      const p = new URLSearchParams({
        q: q.trim(),
        gl: "jp",
        hl: "ko",
        safe: "off",
        pws: "0",
        nfpr: "1",
        desktop: "true",
        ua: "Mozilla/9.0+(Windows+NT+10.0;+Win64;+x64)+Gecko/20100101+FireDragon/135.0+stealth+privatebrowsing+incognito+windowedfullscreen/complate"
      });
      return `https://www.google.co.jp/search?${p.toString()}`;
    },
    buildIframeUrl: (q: string) => `https://www.google.co.jp/search?q=${encodeURIComponent(q)}&gl=jp&hl=ko&safe=off`
  }
];