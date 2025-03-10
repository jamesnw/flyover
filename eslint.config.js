import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    ignores: ["_site/"],
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
