exports.PORT = process.env.PORT || 3100; // use heroku's dynamic port or 3001 if localhost
exports.DEBUG = process.env.DEBUG || true;
exports.REPLAY_ID = process.env.REPLAY_ID || -1;
exports.SERVER_DIRECTORY = process.env.DIRECTORY || 'src';
exports.PLATFORM_EVENT = process.env.PLATFORM_EVENT || '/event/Excel_Event__e';
exports.OAUTH_SETTINGS = {
    loginUrl: process.env.LOGIN_URL || 'https://login.salesforce.com',
    clientId: process.env.CLIENT_ID || "3MVG9KsVczVNcM8wT1kgTkpvDQpHvy4E.Fl_SoORbyNjZJqA29huXyh.c4fAwSFiRto4nKIVuQO.RsJ6K5yWz",
    clientSecret: process.env.CLIENT_SECRET || "6027416036373724024",
    redirectUri: process.env.CALLBACK_URL || 'https://localhost:4200/api/oauth/callback'
};
exports.COOKIE_SECRET = process.env.DB_COOKIE || 'ShhhhItsASECRET';
exports.DB_SETTINGS = {
    database: process.env.DATABASE_NAME || 'postgres',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PW || 'Purdue98!!',
    port: process.env.DATABASE_PORT || 5432,
    ssl: process.env.DATABASE_SSL || false,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000 * 60, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
  };

