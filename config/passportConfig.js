const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const bcrypt = require("bcryptjs");
const config = require("./config");
const { User } = require("../models/userModels");

// Passport Google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({
          email: profile?.emails[0]?.value,
        });

        if (!user) {
          // If user does not exist, create a new user
          const username = await profile?.emails[0]?.value?.split("@")[0];
          const newUser = new users({
            googleId: profile.id,
            displayName: profile.displayName,
            username: username,
            email: profile?.emails[0]?.value,
            isEmailVerify: profile?.emails[0]?.verified,
            avatar: profile?.photos[0]?.value,
            role: "user",
          });
          await newUser.save();
          return done(null, newUser);
        } else {
          // If user exists, update their Google sign-in information
          user.googleId = profile.id;
          user.displayName = profile.displayName;
          user.avatar = profile?.photos[0]?.value;
          user.isEmailVerify = profile?.emails[0]?.verified;
          await User.updateOne({ _id: user._id }, { $set: user });
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
// Local Strategy for username/password login
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (username && password) {
        // Attempt to find user by username first
        let user = await User.findOne({ username });
        if (!user) {
          // If no user found by username, try email
          user = await User.findOne({ email: username });
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username or email." });
        }

        // Validate password if found user with local credentials
        if (user.password) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        } else if (user?.googleId) {
          return done(null, false, { message: "Please sign in with Google" });
        }
      }
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
