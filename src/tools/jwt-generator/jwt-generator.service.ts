import CryptoJS from 'crypto-js';

export type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512';

function base64urlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function wordArrayToBase64url(wordArray: CryptoJS.lib.WordArray): string {
  const base64 = wordArray.toString(CryptoJS.enc.Base64);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateJwt({
  header,
  payload,
  secret,
  algorithm,
}: {
  header: string;
  payload: string;
  secret: string;
  algorithm: JwtAlgorithm;
}): string {
  const headerObj = JSON.parse(header);
  headerObj.alg = algorithm;
  headerObj.typ = headerObj.typ ?? 'JWT';

  const encodedHeader = base64urlEncode(JSON.stringify(headerObj));
  const encodedPayload = base64urlEncode(JSON.stringify(JSON.parse(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  let signature: string;
  if (algorithm === 'HS256') {
    signature = wordArrayToBase64url(CryptoJS.HmacSHA256(signingInput, secret));
  }
  else if (algorithm === 'HS384') {
    signature = wordArrayToBase64url(CryptoJS.HmacSHA384(signingInput, secret));
  }
  else {
    signature = wordArrayToBase64url(CryptoJS.HmacSHA512(signingInput, secret));
  }

  return `${signingInput}.${signature}`;
}
