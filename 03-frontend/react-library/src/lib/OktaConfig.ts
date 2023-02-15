export const OktaConfig = {
    clientId: '0oa877vzlhjL5qRG45d7',
    issuer: 'https://dev-89466154.okta.com/oauth2/default',  // Dev environment that links to an HTTPS secure line to our off default or redirect URI.
    redirectUri: 'http://localhost:3000/login/callback',
    scope: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpCheck: true,
    
}       