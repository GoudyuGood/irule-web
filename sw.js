const GAME_NAME = "pvz_isaac";
const GAME_VERSION = "1.0.0.0";

const CACHE_NAME = JSON.stringify({"name": GAME_NAME, "version": GAME_VERSION});
const CACHE_FILES = ["runner.data",
"runner.js",
"runner.wasm",
"audio-worklet.js",
"game.unx",
"mus_boss1.ogg",
"mus_boss2.ogg",
"mus_boss3.ogg",
"mus_boss_win.ogg",
"mus_calm.ogg",
"mus_ch1.ogg",
"mus_ch1_layer.ogg",
"mus_ch2.ogg",
"mus_ch2_layer.ogg",
"mus_ch3.ogg",
"mus_ch3_layer.ogg",
"mus_echoes.ogg",
"mus_game_over_real.ogg",
"mus_lalala.ogg",
"mus_menu.ogg",
"mus_shop.ogg",
"s_punch1.ogg",
"s_voice_fullhealth.ogg",
"s_voice_percs.ogg",
"s_voice_powerpill.ogg",
"s_voice_speeddown.ogg",
"s_voice_speedup.ogg",
"s_voice_wrong.ogg"
];

self.addEventListener("fetch", (event) => {
  const should_cache = CACHE_FILES.some((f) => {
      return event.request.url.endsWith(f);
  });
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (should_cache) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.allSettled(
      keys.map((key) => {
        try {
          const data = JSON.parse(key);
          if (data && data["name"] && data.name == GAME_NAME &&
              data.version && data.version != GAME_VERSION) {
            return caches.delete(key);
          }
        } catch {
          return;
        }
      })
    )).then(() => {
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
