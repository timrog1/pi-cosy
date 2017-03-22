let passport = require('passport');
let strategy = require('passport-google-oauth').OAuth2Strategy;
let session = require('express-session');
var request = require("request-json");

module.exports = function (app, config)
{
	app.use(session({ secret: config.clientSecret }));
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((obj, done) => done(null, obj));

	function authorizeUser(user, done)
	{
		for(let e of user.emails)
			if(config.users.indexOf(e.value) >= 0)
				return done(null, user);

		return done("User not recognised.");
	}

	passport.use(new strategy({
			clientID: config.clientID,
			clientSecret: config.clientSecret,
			callbackURL: '/auth/google/callback',
			skipUserProfile: true
		},
		(token, tokenSecret, profile, done) => {
			let client = request.createClient('https://www.googleapis.com');
			client.headers['Authorization'] = "Bearer " + token;
			client.get('/plus/v1/people/me', (err, res, body) => authorizeUser(body, done));
		}
	));

	app.get('/auth/google',
		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

	app.get('/auth/google/callback', 
		passport.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/google' }));

	app.use((req, res, next) => 
		  (req.isAuthenticated() || req.url.indexOf('/auth/google') == 0) ? 
		  	next() : 
			res.redirect('/auth/google'));
}