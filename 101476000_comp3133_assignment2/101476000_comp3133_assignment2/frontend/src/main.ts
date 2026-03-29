import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

export function apolloClientFactory(httpLink: HttpLink): ApolloClientOptions<NormalizedCacheObject> {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  return {
    link: ApolloLink.from([
      errorLink,
      httpLink.create({
        uri: 'https://your-backend-url.com/graphql',
        withCredentials: true
      })
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloClientFactory,
      deps: [HttpLink]
    }
  ]
}).catch((err) => console.error(err));;
