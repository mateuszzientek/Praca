const User = require('./user');
const bcrypt= require('bcryptjs')
const localStrategy= require('passport-local').Strategy;

module.exports =function(passport){

    passport.use(
        new localStrategy(
          {
            usernameField: 'email'
          },
          (username, password, done) => {
            User.findOne({ email: username })
              .then((user) => {
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                  if (err) throw err;
                  if (result === true) {
                    return done(null, user);
                  } else {
                    return done(null, false);
                  }
                });
              })
              .catch((err) => {
                throw err;
              });
          }
        )
      );

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id })
      .then((user) => {
        cb(null, user);
      })
      .catch((err) => {
        cb(err, null);
      });
  });

}

