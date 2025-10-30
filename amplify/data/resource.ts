import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.authenticated("identityPool"), allow.guest()]),

  Space: a
    .model({
      name: a.string(),
    })
    .authorization((allow) => [allow.authenticated("identityPool"), allow.guest()]),

  StorageItem: a
    .model({
      name: a.string(),
      parentId: a.id(),
    })
    .secondaryIndexes((index) => [index("parentId")])
    .authorization((allow) => [allow.authenticated("identityPool"), allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
  },
});