import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  {
    ignores: [".open-next/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Change from error to warning
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/error-boundaries": "off",
      "react-hooks/immutability": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default eslintConfig;
