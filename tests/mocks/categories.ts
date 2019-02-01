export default {
  swagger: '2.0',
  info: {
    title: 'content',
    version: '1.0.0',
  },
  paths: {
    '/channel-categories': {
      get: {
        summary: 'Fetch channel categories list',
        operationId: 'getChannelCategories',
        parameters: [
          {
            type: 'string',
            description: 'Region',
            name: 'region',
            in: 'query',
          },
        ],
        tags: ['channel-categories'],
        responses: {
          '200': {
            schema: {
              $ref: '#/definitions/ChannelCategoriesFetchAllResponse',
            },
            description: 'Successful',
          },
        },
      },
    },
  },
  definitions: {
    ChannelCategory: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
        },
        id: {
          type: 'string',
        },
        region: {
          type: 'string',
        },
        sortIndex: {
          type: 'number',
        },
        svg: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
      },
      required: ['id', 'region', 'sortIndex', 'svg', 'title'],
    },
    ChannelCategoriesFetchAllResponse: {
      type: 'object',
      properties: {
        data: {
          items: {
            $ref: '#/definitions/ChannelCategory',
          },
          type: 'array',
        },
        next: {
          type: 'boolean',
        },
      },
      required: ['data'],
    },
  },
}
