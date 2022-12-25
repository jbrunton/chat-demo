const domain = 'jbrunton.eu.auth0.com';

export const config = {
    domain,
    audience: 'https://auth0-test-api.jbrunton-aws.com',
    issuerUrl: `https://${domain}/`,
    clientId: 'Nv4fV7kgzIIQ7LobQgZQpWQ6WOWinFLJ',
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
};
