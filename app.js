const compression = require('compression');
const helmet = require('helmet');
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const license = require('./utils/license');
const dbparse = require('pg-connection-string');

//setting up https
const fs = require('fs');
const key = fs.readFileSync(path.resolve(__dirname + '/certs/key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname + '/certs/cert.pem'));

//setting up sessions
const pg = require('pg');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const config = require('./utils/config');
const dbsettings = config.DB_SETTINGS;


if (process.env.DATABASE_URL) {
  dbsettings = dbparse.parse(process.env.DATABASE_URL);
}

//setting up socket.io
const server = require('https').createServer({ key: key, cert: cert }, app);
const io = require('socket.io')(server);


const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;

const pgPool = new pg.Pool(dbsettings);

//Setup session use for all pages
app.use(session({
  store: new pgSession({
    pool: pgPool,                // Connection string
    tableName: 'session'   // Use another table-name than the default "session" one
  }),
  secret: config.COOKIE_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

//setup routes
const api = require('./routes/api/api');
const indexRouter = require('./routes/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

//Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives()
    }
  })
);


//validate license before proceeding
app.use(function (req, res, next) {
  if (req.method === 'POST') {
    var key = req.body.key;
    license.validate(key).then(function(response){
    if (response.status == 200) {
      next();
    } else {
      res.json(response);
    }
  });
  } else {
    next();
  }
});

//Callback when socket.io connection is established.
io.on("connection", (socket) => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

//add io object to request object for use in routes.
app.use(function (req, res, next) {
  req.io = io;
  req.pool = pgPool;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/', indexRouter);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(PORT, () => console.log(`Running server on port ${PORT}`));
module.exports = app;
