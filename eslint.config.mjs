import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "generated/**",
    // Ignore repository metadata and CI configs — lint only application code
    ".github/**",
  ]),
  {
    files: ["server/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/server/application/**",
            "@/server/infrastructure/**",
            "@/app/**",
            "app/**",
          ],
        },
      ],
    },
  },
  {
    files: ["server/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/server/infrastructure/**"],
        },
      ],
    },
  },
  {
    files: ["server/application/**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    files: ["server/application/service-container.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/server/infrastructure/**"],
        },
      ],
    },
  },
  {
    files: [
      "app/api/auth/**/route.ts",
      "app/(authenticated)/layout.tsx",
      "app/(public)/layout.tsx",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]);

export default eslintConfig;
