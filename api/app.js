const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const dbHelper = require('./database/db');

const usersRouter = require('./routes/user');
const groupRouter = require('./routes/group');
const loginRouter = require('./routes/login');
const mediaRouter = require('./routes/multimedia');
const messageRouter = require('./routes/message');
const notificationRouter = require('./routes/notification');
const commentRouter = require('./routes/comment');
const postRouter = require('./routes/post');

const app = express();

app.use(cors());
app.use(logger('dev'));
// limit payload
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ limit: '10kb', extended: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/../client/build')));

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api', groupRouter);
app.use('/api/messages', messageRouter);
app.use('/api/multimedia', mediaRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/comments', commentRouter);
app.use('/api/posts', postRouter);

// serve react app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/build/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
  res.status(404).send({ error: 'Not found' });
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start server
const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, async () => {
    await dbHelper.initDb();
    // console.log(`Server running on port:${port}`);
  });
}

module.exports = app;
