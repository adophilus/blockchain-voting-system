---
layout: false
---

<script setup>
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'
import openapiYamlDocs from "@blockchain-voting-system/docs-openapi/openapi.yaml?raw";
import { env } from "../src/env.ts"

const capitalize = (val) => String(val).charAt(0).toUpperCase() + String(val).slice(1)

const configuration = {
  content: openapiYamlDocs,
  spec: {
    servers: [
      {
        url: env.VITE_BACKEND_URL,
        description: capitalize(env.VITE_NODE_ENV)
      },
    ]
  },
}
</script>

<ApiReference 
  :configuration="configuration"
/>

