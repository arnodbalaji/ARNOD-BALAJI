import { useEffect, useState } from "react";

let cache = null;
let inflight = null;

export function useSettings() {
  const [settings, setSettings] = useState(cache || {});

  useEffect(() => {
    if (cache) {
      setSettings(cache);
      return;
    }
    if (!inflight) {
      inflight = fetch(`${process.env.REACT_APP_BACKEND_URL}/api/settings`)
        .then((r) => (r.ok ? r.json() : {}))
        .then((d) => {
          cache = d || {};
        })
        .catch(() => {
          cache = {};
        });
    }
    inflight.then(() => setSettings(cache || {}));
  }, []);

  return settings;
}
