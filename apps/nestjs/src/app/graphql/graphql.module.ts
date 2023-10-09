import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => {
        const apolloDriverConfig: ApolloDriverConfig = {
          autoSchemaFile: true,
          useGlobalPrefix: true,
          sortSchema: true,
          plugins: [],
          installSubscriptionHandlers: true,
        };

        return apolloDriverConfig;
      },
    }),
  ],
})
export class GraphqlModule {}
