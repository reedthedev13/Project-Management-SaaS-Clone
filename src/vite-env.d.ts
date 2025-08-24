/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // your backend URL
  // add any other VITE_ env vars here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
