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
        const email = profile?.emails[0]?.value;
        let user = await User.findOne({ email });
        
        if (!user) {
          // Generate a hashed password concurrently
          const [hashedPassword, username] = await Promise.all([
            bcrypt.hash(email, 10),
            email.split("@")[0]
          ]);

          // Create and save new user
          user = new User({
            googleId: profile.id,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            password: hashedPassword,
            username: username,
            email: email,
            isEmailVerified: profile?.emails[0]?.verified,
            avatar: profile?.photos[0]?.value,
          });
          await user.save();
        } else {
          // Update existing user details if necessary
          const updates = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            avatar: profile?.photos[0]?.value,
            isEmailVerified: profile?.emails[0]?.verified,
          };

          // Only update if data has changed
          await User.updateOne({ _id: user._id }, { $set: updates });
        }

        return done(null, user);
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
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
