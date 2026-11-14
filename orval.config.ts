import { defineConfig } from "orval";

export default defineConfig({
  agonApi: {
    input: {
      target: process.env.OPENAPI_SPEC_PATH ?? "https://localhost:5001/Swagger/v1/swagger.json",
    },
    output: {
      target: "src/api/generated.ts",
      schemas: "src/api/models",
      client: "fetch",
      override: {
        mutator: {
          path: "./customFetchOrval.ts",
          name: "customFetch",
        },
      },
    },
  },
});
