import { configuration } from '@kaenjs/core/configuration';
import * as _passport from 'passport';
import { PassportConfiguration } from './configuration';
const { UsernameKey, PassowrdKey, Strategies, Model, SaltRounds } = configuration.passport as PassportConfiguration;

_passport.serializeUser(function (user: any, done) {
	console.log('serialize');
	done(null, user.id.toString());
});
_passport.deserializeUser(function (id, done) {
	console.log('deserialize', id);
	// done(null, {id:0, username:'demo', password:'demo'});
	Model().firstOrDefault(id).then(user => done(null, user)).catch(done);
});