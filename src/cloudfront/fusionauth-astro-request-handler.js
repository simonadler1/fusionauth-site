var astroPrefixes = [
  '/articles',
  '/blog',
  '/docs',
  '/dev-tools'
];

var addSlashes = [
  '^/[\\w\\d-]*$',
  '^/docs/quickstarts$',
  '^/articles/[\\w\\d-]*$',
  '^/blog/[\\w\\d-]*/[\\w\\d-]+$',
];

var removeSlashes = [
  '^/blog/[\\w\\d-]*/$',
  '^/dev-tools/[\\w\\d-]*/$',
  '^/docs/quickstarts/[\\w\\d-]*/$',
  '^/articles/[\\w\\d-]*/[\\w\\d-]*/$'
];

var removeSlashExclusions = [
  '^/blog/latest/$',
];

// target with group, replacer prefix
var migrationRedirects = [
  ['^/blog/\\d\\d\\d\\d/\\d\\d/\\d\\d/([\\w\\d-]*)', '/blog/'],
  ['^/articles/oauth/what-is-oauth*', '/articles/oauth/modern-guide-to-oauth'],
]

function handler(event) {
  var request = event.request;
  var uri = event.request.uri;

  if (astroPrefixes.find(pre => uri.startsWith(pre))) {
    var redirect = handleRedirects(uri);
    if (redirect) {
      return redirect;
    }

    var addOrRemove  = addOrRemoveSlash(uri);
    if (addOrRemove === true) {
      uri = uri + '/';
    } else if (addOrRemove === false) {
      return redirRemove(uri);
    }

    if (uri.endsWith('/')) {
      uri = uri + 'index.html';
    } else if (!uri.endsWith('.html')) {
      uri = uri + '.html';
    }
    request.uri = uri;

  }
  return request;
}

// true = add, false = remove, null = nothing
function addOrRemoveSlash(uri) {
  if (addSlashes.find(regex => uri.match(regex))) {
    return true;
  } else if (removeSlashes.find(regex => uri.match(regex))
             && !removeSlashExclusions.find(regex => uri.match(regex))) {
    return false;
  }
  return null;
}

function handleRedirects(uri) {
  for (const redirect of migrationRedirects) {
    var match = uri.match(redirect[0]);
    if (match) {
      uri = uri.replace(match[0], redirect[1] + (match[1] ? match[1] : ''));
      return {
        statusCode: 301,
        statusDescription: 'Moved',
        headers:{
          'location': { value: uri }
        }
      };
    }
  }
}

function redirRemove(uri) {
  uri = uri.substring(0, uri.length - 1);
  return {
    statusCode:301,
    statusDescription:'Moved',
    headers:{
      'location':{ value: uri }
    }
  };
}
