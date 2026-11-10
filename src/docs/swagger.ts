import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Pokédex REST API', version: '1.0.0', description: 'CRUD API for Pokémon and types.' },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        PokemonInput: { type: 'object', required: ['name', 'height', 'weight', 'types'], properties: { name: { type: 'string' }, height: { type: 'number', minimum: 0 }, weight: { type: 'number', minimum: 0 }, imageUrl: { type: 'string', format: 'uri', nullable: true }, types: { type: 'array', minItems: 1, maxItems: 2, items: { type: 'string' } } } },
        Pokemon: { allOf: [{ $ref: '#/components/schemas/PokemonInput' }, { type: 'object', properties: { id: { type: 'integer' }, createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' } } }] },
      },
    },
    paths: {
      '/api/v1/pokemon': {
        get: { summary: 'List Pokémon', parameters: [{ in: 'query', name: 'search', schema: { type: 'string' } }, { in: 'query', name: 'type', schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } }, { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }, { in: 'query', name: 'sortBy', schema: { type: 'string', enum: ['id', 'name'] } }, { in: 'query', name: 'order', schema: { type: 'string', enum: ['asc', 'desc'] } }], responses: { '200': { description: 'Paginated Pokémon list' } } },
        post: { summary: 'Create Pokémon', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonInput' } } } }, responses: { '201': { description: 'Created' } } },
      },
      '/api/v1/pokemon/{id}': {
        get: { summary: 'Get Pokémon detail', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Detail' }, '404': { description: 'Not found' } } },
        put: { summary: 'Update Pokémon', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonInput' } } } }, responses: { '200': { description: 'Updated' } } },
        delete: { summary: 'Delete Pokémon', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { '204': { description: 'Deleted' } } },
      },
      '/api/v1/types': { get: { summary: 'List types', responses: { '200': { description: 'Type list' } } } },
      '/api/v1/auth/register': { post: { summary: 'Register user', responses: { '201': { description: 'Registered' } } } },
      '/api/v1/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'JWT token' } } } },
    },
  },
  apis: [],
});
