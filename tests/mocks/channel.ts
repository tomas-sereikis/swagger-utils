export default {
  swagger: '2.0',
  basePath: '/',
  schemes: ['https'],
  info: {
    title: 'content',
    version: '1.0.0',
  },
  tags: [],
  paths: {
    '/channels': {
      get: {
        summary: 'Fetch channels list',
        operationId: 'getChannels',
        parameters: [
          {
            type: 'string',
            description: 'Category id',
            name: 'categoryId',
            in: 'query',
          },
          {
            type: 'string',
            description: 'Creator id',
            name: 'creatorId',
            in: 'query',
          },
          {
            type: 'array',
            description: `List of id's`,
            items: {
              type: 'string',
            },
            collectionFormat: 'multi',
            name: 'id',
            in: 'query',
          },
          {
            type: 'boolean',
            description: 'Private channels included',
            default: false,
            name: 'private',
            in: 'query',
          },
          {
            type: 'string',
            description: 'Region name',
            name: 'region',
            in: 'query',
          },
        ],
        tags: ['channels'],
        responses: {
          '200': {
            schema: {
              $ref: '#/definitions/ChannelsFetchAllResponse',
            },
            description: 'Successful',
          },
        },
      },
      post: {
        summary: 'Create channel',
        operationId: 'postChannels',
        parameters: [
          {
            in: 'body',
            name: 'body',
            schema: {
              $ref: '#/definitions/ChannelsCreateRequest',
            },
          },
        ],
        tags: ['channels'],
        responses: {
          '200': {
            schema: {
              $ref: '#/definitions/ChannelsFetchByIdResponse',
            },
            description: 'Successful',
          },
        },
      },
    },
  },
  definitions: {
    ChannelsFetchByIdResponse: {
      type: 'object',
      properties: {
        data: {
          $ref: '#/definitions/Channel',
        },
        next: {
          type: 'boolean',
        },
      },
      required: ['data'],
    },
    ChannelsCreateRequest: {
      type: 'object',
      properties: {
        avatarImageId: {
          type: 'string',
        },
        coverImageId: {
          type: 'string',
        },
        creatorId: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        playlistMode: {
          type: 'string',
          default: 'shuffle',
          enum: ['new', 'shuffle'],
        },
        private: {
          type: 'boolean',
        },
        title: {
          type: 'string',
        },
        website: {
          type: 'string',
        },
      },
      required: ['avatarImageId', 'coverImageId', 'creatorId', 'description', 'private', 'title'],
    },
    Channel: {
      type: 'object',
      properties: {
        avatarImageId: {
          type: 'string',
        },
        coverImageId: {
          type: 'string',
        },
        creatorId: {
          type: 'string',
        },
        datetime: {
          type: 'string',
          format: 'date',
        },
        description: {
          type: 'string',
        },
        followers: {
          type: 'number',
        },
        id: {
          type: 'string',
        },
        playlistMode: {
          type: 'string',
          enum: ['new', 'shuffle'],
        },
        private: {
          type: 'boolean',
        },
        showInNews: {
          type: 'boolean',
        },
        title: {
          type: 'string',
        },
        website: {
          type: 'string',
        },
      },
      required: [
        'avatarImageId',
        'coverImageId',
        'creatorId',
        'datetime',
        'description',
        'followers',
        'id',
        'playlistMode',
        'private',
        'showInNews',
        'title',
      ],
    },
    ChannelsFetchAllList: {
      type: 'array',
      items: {
        $ref: '#/definitions/Channel',
      },
    },
    ChannelsFetchAllResponse: {
      type: 'object',
      properties: {
        data: {
          $ref: '#/definitions/ChannelsFetchAllList',
          type: 'array',
        },
        next: {
          type: 'boolean',
        },
      },
      required: ['data'],
    },
    Wakie: {
      type: 'object',
      properties: {
        audioId: {
          type: 'string',
        },
        authorName: {
          type: 'string',
        },
        channelId: {
          type: 'string',
        },
        comments: {
          type: 'number',
        },
        creatorId: {
          type: 'string',
        },
        datetime: {
          type: 'string',
          format: 'date',
        },
        duration: {
          type: 'number',
        },
        id: {
          type: 'string',
        },
        imageId: {
          type: 'string',
        },
        likes: {
          type: 'number',
        },
        plays: {
          type: 'number',
        },
        publishDatetime: {
          type: 'string',
          format: 'date',
        },
        status: {
          type: 'string',
          enum: ['created', 'finished', 'error'],
        },
        title: {
          type: 'string',
        },
      },
      required: [
        'audioId',
        'authorName',
        'channelId',
        'comments',
        'creatorId',
        'datetime',
        'duration',
        'id',
        'imageId',
        'likes',
        'plays',
        'publishDatetime',
        'status',
        'title',
      ],
    },
  },
}
