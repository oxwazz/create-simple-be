import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { resolvers } from '@generated/type-graphql'
import { buildSchema } from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import express, { Request } from 'express'
const prisma = new PrismaClient()

const tes = async () => {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  })

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    schema, // from previous step
    context: ({ req }) => ({ prisma, req }),
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    /**
     * What's up with this embed: true option?
     * These are our recommended settings for using AS;
     * they aren't the defaults in AS3 for backwards-compatibility reasons but
     * will be the defaults in AS4. For production environments, use
     * ApolloServerPluginLandingPageProductionDefault instead.
     **/
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  })

  const app = express()

  await server.start()
  server.applyMiddleware({ app })

  // The `listen` method launches a web server.
  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀  Server ready at `)
  })
}

tes()
