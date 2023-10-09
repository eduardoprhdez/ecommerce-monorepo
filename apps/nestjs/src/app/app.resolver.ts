import { Resolver, Query } from '@nestjs/graphql';

@Resolver(() => String)
export class AppResolver {
  @Query(() => String)
  async author() {
    return 'Hello world graphql!';
  }
}
