import { configuration } from '@kaenjs/core/configuration';
import * as _passport from 'passport';
import { PassportConfiguration } from './configuration';
if(!configuration.passport) {
	throw new Error('@kaenjs/passport configuration is missing');
	process.exit(0);
}
const { serialize, deserialize, UsernameKey, PassowrdKey, Strategies, Model, SaltRounds } = configuration.passport as PassportConfiguration;

function toDone(fn:(...args:any[])=>Promise<any>) {
	return function(...args:any[]) {
		let done:(a:any,b:any)=>void = args.splice(-1)[0] as any;
		fn(...args).then((res:any)=>{
			done(null,res);
		}).catch(err=>{
			done(err, null);
		});
	}
}
async function _serialize (user:any) {
	return user.id.toString();
}
async function _deserialize (id:any) {
	return Model().firstOrDefault(id);
}
_passport.serializeUser(toDone(serialize||_serialize));
_passport.deserializeUser(toDone(deserialize||_deserialize));