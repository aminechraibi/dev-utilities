export interface ParsedHeader {
  name: string
  value: string
  description: string
  category: string
}

export const headerDescriptions: Record<string, { description: string; category: string }> = {
  // General / Entity headers
  'content-type': {
    description: 'Indicates the media type (MIME type) and character encoding of the resource.',
    category: 'Content',
  },
  'content-length': {
    description: 'The size of the response body in bytes.',
    category: 'Content',
  },
  'content-encoding': {
    description: 'Specifies the encoding applied to the entity-body (e.g. gzip, br, deflate).',
    category: 'Content',
  },
  'content-language': {
    description: 'Describes the human language(s) of the response content.',
    category: 'Content',
  },
  'content-disposition': {
    description: 'Indicates whether the content should be displayed inline or downloaded as an attachment.',
    category: 'Content',
  },
  'content-range': {
    description: 'Indicates where in the full body a partial message belongs.',
    category: 'Content',
  },
  'transfer-encoding': {
    description: 'Specifies the transfer encoding of the response body (e.g. chunked).',
    category: 'Content',
  },

  // Caching
  'cache-control': {
    description: 'Directives for caching mechanisms in both requests and responses (e.g. no-cache, max-age, public, private).',
    category: 'Caching',
  },
  'etag': {
    description: 'An identifier for a specific version of a resource, used for cache validation.',
    category: 'Caching',
  },
  'expires': {
    description: 'The date/time after which the response is considered stale.',
    category: 'Caching',
  },
  'last-modified': {
    description: 'The date/time when the resource was last modified on the server.',
    category: 'Caching',
  },
  'vary': {
    description: 'Tells caches which request headers to use to determine whether a cached response is fresh.',
    category: 'Caching',
  },
  'age': {
    description: 'Time in seconds the object has been in a proxy cache.',
    category: 'Caching',
  },
  'pragma': {
    description: 'Implementation-specific header for backwards compatibility with HTTP/1.0 caches.',
    category: 'Caching',
  },

  // Connection
  'connection': {
    description: 'Controls whether the network connection stays open after the current transaction (e.g. keep-alive, close).',
    category: 'Connection',
  },
  'keep-alive': {
    description: 'Allows the sender to hint about how the connection may be used (timeout, max).',
    category: 'Connection',
  },
  'upgrade': {
    description: 'Asks the server to upgrade to a different protocol (e.g. WebSocket).',
    category: 'Connection',
  },

  // Security
  'strict-transport-security': {
    description: 'HSTS: Forces browsers to use HTTPS for future requests. Includes max-age and optional includeSubDomains.',
    category: 'Security',
  },
  'content-security-policy': {
    description: 'CSP: Controls which resources the browser is allowed to load, helping prevent XSS attacks.',
    category: 'Security',
  },
  'x-frame-options': {
    description: 'Prevents clickjacking by controlling whether the page can be embedded in frames (DENY, SAMEORIGIN, ALLOW-FROM).',
    category: 'Security',
  },
  'x-content-type-options': {
    description: 'Prevents MIME-type sniffing. When set to "nosniff", browsers follow the declared Content-Type.',
    category: 'Security',
  },
  'x-xss-protection': {
    description: 'Enables or disables the browser\'s built-in XSS filter (largely superseded by CSP).',
    category: 'Security',
  },
  'referrer-policy': {
    description: 'Controls how much referrer information is included with requests (e.g. no-referrer, strict-origin).',
    category: 'Security',
  },
  'permissions-policy': {
    description: 'Allows or denies browser features (camera, geolocation, etc.) for the page and its iframes.',
    category: 'Security',
  },
  'cross-origin-opener-policy': {
    description: 'COOP: Isolates browsing context to prevent cross-origin attacks like Spectre.',
    category: 'Security',
  },
  'cross-origin-embedder-policy': {
    description: 'COEP: Requires all sub-resources to be fetched with CORS or CORP headers.',
    category: 'Security',
  },
  'cross-origin-resource-policy': {
    description: 'CORP: Protects resources from being loaded by cross-origin requests.',
    category: 'Security',
  },

  // CORS
  'access-control-allow-origin': {
    description: 'CORS: Specifies which origins are allowed to access the resource.',
    category: 'CORS',
  },
  'access-control-allow-methods': {
    description: 'CORS: Lists the HTTP methods allowed for cross-origin requests.',
    category: 'CORS',
  },
  'access-control-allow-headers': {
    description: 'CORS: Lists the HTTP headers allowed in cross-origin requests.',
    category: 'CORS',
  },
  'access-control-expose-headers': {
    description: 'CORS: Lists headers that browsers are allowed to access from a cross-origin response.',
    category: 'CORS',
  },
  'access-control-max-age': {
    description: 'CORS: How long (in seconds) the preflight response can be cached.',
    category: 'CORS',
  },
  'access-control-allow-credentials': {
    description: 'CORS: Indicates whether the response can be exposed when credentials are included.',
    category: 'CORS',
  },

  // Authentication
  'authorization': {
    description: 'Contains credentials for authenticating the user with the server (e.g. Bearer token, Basic auth).',
    category: 'Authentication',
  },
  'www-authenticate': {
    description: 'Defines the authentication scheme that should be used to access the resource.',
    category: 'Authentication',
  },
  'proxy-authenticate': {
    description: 'Defines the authentication method to access a proxy.',
    category: 'Authentication',
  },
  'set-cookie': {
    description: 'Sends a cookie from the server to the client, with optional attributes (Secure, HttpOnly, SameSite, Path, Expires).',
    category: 'Cookies',
  },
  'cookie': {
    description: 'Contains stored HTTP cookies from the client.',
    category: 'Cookies',
  },

  // Redirects & Location
  'location': {
    description: 'Used in redirects (3xx) or resource creation (201) to indicate the URL of the resource.',
    category: 'Redirect',
  },

  // Request info
  'host': {
    description: 'Specifies the domain name and optional port of the server.',
    category: 'Request',
  },
  'user-agent': {
    description: 'Contains information about the client application making the request.',
    category: 'Request',
  },
  'accept': {
    description: 'Informs the server about media types the client can process.',
    category: 'Request',
  },
  'accept-encoding': {
    description: 'Indicates the content-encoding algorithms the client can understand.',
    category: 'Request',
  },
  'accept-language': {
    description: 'Indicates the natural languages the client prefers.',
    category: 'Request',
  },
  'referer': {
    description: 'Contains the URL of the page that linked to the current request.',
    category: 'Request',
  },

  // Server
  'server': {
    description: 'Contains information about the software used by the origin server.',
    category: 'Server',
  },
  'date': {
    description: 'The date and time at which the message was sent.',
    category: 'Server',
  },
  'via': {
    description: 'Added by proxies to track message forwarding and protocol upgrades.',
    category: 'Server',
  },
  'x-powered-by': {
    description: 'Indicates the technology powering the server (e.g. Express, PHP). Often disabled for security.',
    category: 'Server',
  },
  'x-request-id': {
    description: 'A unique identifier for the request, useful for tracing and debugging.',
    category: 'Server',
  },
  'x-correlation-id': {
    description: 'A correlation identifier for tracing requests across distributed systems.',
    category: 'Server',
  },

  // Compression
  'accept-ranges': {
    description: 'Indicates whether the server supports range requests for partial content.',
    category: 'Content',
  },
  'link': {
    description: 'Provides relationships between the current document and other resources (e.g. preload, preconnect, canonical).',
    category: 'Content',
  },
  'alt-svc': {
    description: 'Advertises alternative services (e.g. HTTP/3 via QUIC) that the server supports.',
    category: 'Server',
  },
};

export function parseHeaders(raw: string): ParsedHeader[] {
  const lines = raw.split(/\r?\n/);
  const results: ParsedHeader[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    // Skip HTTP status line
    if (/^HTTP\//.test(trimmed)) {
      continue;
    }

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) {
      continue;
    }

    const name = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();

    if (!name) {
      continue;
    }

    const key = name.toLowerCase();
    const meta = headerDescriptions[key];

    results.push({
      name,
      value,
      description: meta?.description ?? 'No description available for this header.',
      category: meta?.category ?? 'Other',
    });
  }

  return results;
}
