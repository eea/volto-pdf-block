import config from '@plone/volto/registry';
const url = require('url');

export function urlToCorsProxy(targetUrl) {
  const allowed_cors_destinations =
    config.settings.allowed_cors_destinations || [];
  const parsed = url.parse(targetUrl);
  const nextUrl =
    allowed_cors_destinations.indexOf(parsed.host) === -1
      ? targetUrl
      : `/cors-proxy/${targetUrl}`;
  return nextUrl;
}
