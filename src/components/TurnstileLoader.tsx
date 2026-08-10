"use client";

import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
    __lcm_turnstile_cb?: () => void;
  }
}

/**
 * Loads the Cloudflare Turnstile SDK once and bridges the script
 * onLoad event to any page waiting to render its widget.
 *
 * Pattern mirrors linkchinamed-web/src/components/TurnstileLoader.tsx.
 */
export default function TurnstileLoader() {
  return (
    <Script
      id="cf-turnstile"
      strategy="afterInteractive"
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      onLoad={() => {
        if (typeof window.__lcm_turnstile_cb === "function") {
          window.__lcm_turnstile_cb();
          window.__lcm_turnstile_cb = undefined;
        }
      }}
    />
  );
}
