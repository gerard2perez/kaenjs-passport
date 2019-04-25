import * as _passport from 'passport';
import { configuration } from '@kaenjs/core/configuration';
const { authentication: { UsernameKey, PassowrdKey, Strategies, Model, SaltRounds, Keys, Session } } = configuration;

_passport.serializeUser(function (user: any, done) {
	console.log('serialize');
	done(null, user.id.toString());
});
_passport.deserializeUser(function (id, done) {
	console.log('deserialize', id);
	// done(null, {id:0, username:'demo', password:'demo'});
	Model().firstOrDefault(id).then(user => done(null, user)).catch(done);
});