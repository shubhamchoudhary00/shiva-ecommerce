const serviceAccount = {
    type: process.env.FIREBASE_PRIVATE_TYPE,
    project_id: process.env.FIREBASE_PRIVATE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_PRIVATE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_PRIVATE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_PRIVATE_AUTH_URI,
    token_uri: process.env.FIREBASE_PRIVATE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_PRIVATE_AUTH_PROVIDER,
    client_x509_cert_url: process.env.FIREBASE_PRIVATE_CLIENT,
    universe_domain: process.env.FIREBASE_PRIVATE_UNIVERSE_DOMAIN,
  };

  module.exports=serviceAccount;