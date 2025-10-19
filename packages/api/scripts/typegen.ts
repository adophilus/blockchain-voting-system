import { writeFile } from 'node:fs/promises'
import SwaggerParser from '@apidevtools/swagger-parser'
import openapiSchema from '@vs/docs-openapi/openapi.yaml?raw'
import openapiTS, { astToString } from 'openapi-typescript'
import { generateZodClientFromOpenAPI } from 'openapi-zod-client'
import type { oas30 } from 'openapi3-ts'
import ts from 'typescript'

const BLOB = ts.factory.createTypeReferenceNode(
  ts.factory.createIdentifier('Blob')
)
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()) // `null`

const _types = astToString(
  await openapiTS(openapiSchema, {
    transform(schemaObject) {
      if (schemaObject.format === 'binary') {
        return {
          schema: schemaObject.nullable
            ? ts.factory.createUnionTypeNode([BLOB, NULL])
            : BLOB,
          questionToken: false
        }
      }
    }
  })
)

await writeFile('./src/api/types.ts', _types)

const openApiDoc = (await SwaggerParser.bundle(
  '../docs-openapi/build/openapi.yaml'
)) as oas30.OpenAPIObject

await generateZodClientFromOpenAPI({
  openApiDoc,
  distPath: './src/api/schema.ts',
  options: {
    withAlias: false,
    shouldExportAllSchemas: true,
    withDocs: true
    // additionalPropertiesDefaultValue: false
  }
})

console.log('✅ Generated types')
