import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/platform-browser/http';
import { ApolloClientOptions, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { onError } from '@apollo/client/link/error';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

export function apolloClientFactory(httpLink: HttpLink): ApolloClientOptions<NormalizedCacheObject> {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  return {
    link: ApolloLink.from([
      errorLink,
      httpLink.create({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include',
      }),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideApollo(apolloClientFactory),
  ],
}).catch((err) => console.error(err));
