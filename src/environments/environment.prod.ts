export const environment = {
  production: true,
  apiUrl: 'http://sgq.example.com:8080',
  tokenWhitelistedDomains: [ new RegExp('sgq.example.com:8080') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
