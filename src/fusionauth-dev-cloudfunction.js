function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var authString = 'Basic ZnVzaW9uYXV0aDpyb2Nrcw=='; // Basic fusionauth:rocks
  if (!headers.authorization || headers.authorization.value !== authString) {
    return {
      statusCode: 401,
      statusDescription: 'Unauthorized',
      headers: {
        'www-authenticate': { value: 'Basic' }
      }
    };
  }

  var uri = request.uri;
  if (uri.endsWith('/') && removeSlash(uri)) {
    return {
      statusCode: 301,
      statusDescription: 'Moved',
      headers: {
        'location': { value: uri.substring(0, uri.length - 1) }
      }
    };
  }

  var redirect = calculateRedirect(uri);
  if (redirect !== null) {
    return {
      statusCode: 301,
      statusDescription: 'Moved',
      headers: {
        'location': { value: uri.substring(0, uri.length - 1) }
      }
    };
  }

  var slashIndex = request.uri.lastIndexOf('/');
  var dotIndex = request.uri.indexOf('.', slashIndex);
  console.log(slashIndex + '-' + dotIndex);
  if (slashIndex < request.uri.length - 1 && dotIndex < 0) {
    request.uri = request.uri + '.html';
  }
  return request;
}

function removeSlash(uri) {
  var indexPages = {
    '/': true,
    '/blog/': true,
    '/docs/': true,
    '/docs/v1/tech/': true,
    '/docs/v1/tech/account-management/': true,
    '/docs/v1/tech/admin-guide/': true,
    '/docs/v1/tech/apis/': true,
    '/docs/v1/tech/apis/connectors/': true,
    '/docs/v1/tech/apis/identity-providers/': true,
    '/docs/v1/tech/apis/messengers/': true,
    '/docs/v1/tech/client-libraries/': true,
    '/docs/v1/tech/connectors/': true,
    '/docs/v1/tech/core-concepts/': true,
    '/docs/v1/tech/email-templates': true,
    '/docs/v1/tech/events-webhooks/': true,
    '/docs/v1/tech/example-apps/': true,
    '/docs/v1/tech/guides/': true,
    '/docs/v1/tech/identity-providers/': true,
    '/docs/v1/tech/identity-providers/external-jwt/': true,
    '/docs/v1/tech/identity-providers/openid-connect/': true,
    '/docs/v1/tech/identity-providers/samlv2-idp-initiated/': true,
    '/docs/v1/tech/identity-providers/samlv2/': true,
    '/docs/v1/tech/installation-guide/': true,
    '/docs/v1/tech/installation-guide/kubernetes/': true,
    '/docs/v1/tech/integrations/': true,
    '/docs/v1/tech/lambdas/': true,
    '/docs/v1/tech/messengers/': true,
    '/docs/v1/tech/migration-guide': true,
    '/docs/v1/tech/oauth/': true,
    '/docs/v1/tech/plugins/': true,
    '/docs/v1/tech/samlv2/': true,
    '/docs/v1/tech/themes/': true,
    '/docs/v1/tech/tutorials/': true,
    '/docs/v1/tech/tutorials/two-factor/': true,
    '/learn/expert-advice/authentication/': true,
    '/learn/expert-advice/ciam/': true,
    '/learn/expert-advice/dev-tools/': true,
    '/learn/expert-advice/identity-basics/': true,
    '/learn/expert-advice/oauth/': true,
    '/learn/expert-advice/security/': true,
    '/learn/expert-advice/tokens/': true
  }
  return indexPages[uri] !== true;
}

function calculateRedirect(uri) {
  var redirects = {
    '/features/architecture/': '/platform/built-for-developers',
    '/features/advanced-registration-forms/': '/platform/customizable',
    '/features/breached-password-detection/': '/features/authentication',
    '/features/built-for-developers/': '/platform/built-for-developers',
    '/features/connectors/': '/features/authentication',
    '/features/password-control/': '/features/passwordless',
    '/features/scalability/': '/platform/scalable',
    '/features/security-data-compliance/': '/security-data-compliance',
    '/features/single-sign-on/': '/features/single-sign-on',
    '/features/user-experience/': '/platform/customizable',
    '/features/user-management-reporting/': '/features/user-management',
    '/upgrade/from-homegrown/': '/compare',
    '/upgrade/from-open-source/': '/compare',
    '/upgrade/from-saas/': '/compare'
  }
  return redirects.hasOwnProperty(uri) ? redirects[uri] : null;
}

