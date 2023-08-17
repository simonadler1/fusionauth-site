/*
 * Drop this into the bottom of the request handler to test it
 */

const testList = [
  {
    requestUri: '/blog',
    expectedUri: '/blog/index.html',
  },
  {
    requestUri: '/docs',
    expectedUri: '/docs/index.html',
  },
  {
    requestUri: '/docs/quickstarts',
    expectedUri: '/docs/quickstarts/index.html',
  },
  {
    requestUri: '/docs/quickstarts/quickstart-springboot-web',
    expectedUri: '/docs/quickstarts/quickstart-springboot-web.html',
  },
  {
    requestUri: '/docs/quickstarts/quickstart-springboot-web/',
    expectedUri: '/docs/quickstarts/quickstart-springboot-web',
    expectedStatus: 301,
  },
  {
    requestUri: '/dev-tools',
    expectedUri: '/dev-tools/index.html',
  },
  {
    requestUri: '/blog/author/brian-pontarelli/',
    expectedUri: '/blog/author/brian-pontarelli/index.html',
  },
  {
    requestUri: '/blog/2021/02/09/single-sign-on-sso-with-fusionauth',
    expectedUri: '/blog/single-sign-on-sso-with-fusionauth',
    expectedStatus: 301,
  },
  {
    requestUri: '/blog/single-sign-on-sso-with-fusionauth/',
    expectedUri: '/blog/single-sign-on-sso-with-fusionauth',
    expectedStatus: 301,
  },
  {
    requestUri: '/docs/v1/tech/apis/authentication',
    expectedUri: '/docs/v1/tech/apis/authentication.html'
  },
  {
    requestUri: '/docs/v1/tech/tutorials/integrate-angular',
    expectedUri: '/docs/v1/tech/tutorials/integrate-angular.html'
  },
  {
    requestUri: '/articles/authentication',
    expectedUri: '/articles/authentication/index.html'
  },
  {
    requestUri: '/articles/authentication/common-authentication-implementation-risks/',
    expectedUri: '/articles/authentication/common-authentication-implementation-risks',
    expectedStatus: 301,
  },
  {
    requestUri: '/dev-tools',
    expectedUri: '/dev-tools/index.html'
  },
  {
    requestUri: '/dev-tools/jwt-decoder/',
    expectedUri: '/dev-tools/jwt-decoder',
    expectedStatus: 301,
  },
  {
    requestUri: '/blog/category/tutorial',
    expectedUri: '/blog/category/tutorial/index.html'
  },
  {
    requestUri: '/articles/oauth/what-is-oauth',
    expectedUri: '/articles/oauth/modern-guide-to-oauth'
  },
];

testList.map(test => {
           console.log('testing', test.requestUri);
           return test;
         })
        .map(test => ([{request: {uri: test.requestUri, headers: {}}}, test.expectedUri]))
        .map(([event, expected]) => [metaHandler(event), expected])
        .forEach(([response, expected]) => {
          if (response.uri === expected) {
            console.log('passed', expected);
          } else if (response.statusCode === 301 && response?.headers?.location?.value === expected) {
            console.log('passed with redirect', expected);
          } else {
            console.error('failed. got', response.uri, 'expected', expected);
          }
        });