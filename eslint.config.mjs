import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extends default configurations
const eslintConfig = {
  extends: [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn', // You can change this to 'off' if you want to disable it entirely
      { argsIgnorePattern: '^_' }, // Ignores variables starting with '_'
    ],
    // Add any other custom rules you need to disable or customize here
  },
};

export default eslintConfig;
