import { cpSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    publicDir: false,
    plugins: [
        {
            name: "copy-runtime-images",
            apply: "build",
            closeBundle() {
                cpSync(resolve(root, "imagens"), resolve(root, "dist", "imagens"), { recursive: true });
            }
        }
    ]
});