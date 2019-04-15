import { configuration } from '@kaenjs/core/configuration';
import { KaenContext } from '@kaenjs/core';
import { hash } from './hash';
import { targetPathNoSrc } from '@kaenjs/core/utils';
import * as _passport from 'passport';
import * as _session from 'express-session';
import { resolve } from 'dns';
declare global {
	namespace KaenExtensible {
		interface KaenContext {
			isLogged:boolean
			login:(user:any)=>Promise<void>
			logout:()=>void
		}
	}
}
// import * as _passport from 'passport';
// import * as _session from 'express-session';

// const _passport = require(targetPathNoSrc('node_modules', 'passport'));
// const _session = require(targetPathNoSrc('node_modules', 'express-session'));

const { authentication: { UsernameKey, PassowrdKey, Strategies, Model, SaltRounds, Keys, Session } } = configuration;

export async function CreateUser(username: string, password: string, data: any) {
	const payload = Object.assign({}, data, {
		[PassowrdKey]: await hash(password)
	});
	return Model().findOrCreate({
		[UsernameKey]: username
	}, payload);
}

/** register the strategies to passport */

for (const { Strategy, Options, Auth } of Strategies) {
	let args = [Options, Auth].filter(f => f);
	// @ts-ignore
	_passport.use(new Strategy(...args));
}
_passport.serializeUser(function (user: any, done) {
	console.log('serialize');
	done(null, user.id.toString());
});
_passport.deserializeUser(function (id, done) {
	console.log('deserialize', id);
	// done(null, {id:0, username:'demo', password:'demo'});
	Model().firstOrDefault(id).then(user => done(null, user)).catch(done);
});

class Mock {
	constructor(ctx: KaenContext, target: any) {
		return new Proxy(target, {
			get(target, property) {
				switch(property) {
					case 'body':
						// @ts-ignore
						return ctx.params.body;
					case 'query':
						return ctx.params.query;
					case 'redirect':
						return ctx.redirect.bind(ctx);
					default:
						return target[property];
				}
			},
			set(target, property, value) {
				target[property] = value;
				return true;
			}
		});
	}
}
function _Session() {
	let options = Object.assign({}, {secret:Keys}, Session);
	let session = _session(options);
	return async function (ctx: KaenContext) {
		await new Promise(resolve => {
			//@ts-ignore
			session(ctx.req, ctx.res, resolve);
		});
	};
}
export { _Session as Session, _passport as PassportInstance };
export function Passport(router?:any) {
	if(router)router.addMatchCondition((r,c)=>{
		let auth = !r.isProtected || (r.isProtected && c.isLogged);
		if(!auth)c.status = 401;
		return auth;
	});
	let init = _passport.initialize();
	let session = _passport.session();
	return async function (ctx: KaenContext) {
		Object.defineProperty(ctx.state, 'user', {
			get() {
				// @ts-ignore
				return ctx.req.user;
			}
		});
		Object.defineProperty(ctx, 'login', {
			get(){
				return function login(user:any) {
					
					return new Promise((resolve,reject)=>{
						//@ts-ignore
						ctx.req.login(user,(err)=>err?reject(err):resolve());
					});
				}
			}
		});
		Object.defineProperty(ctx, 'logout', {
			get(){
				return function logout() {
					// @ts-ignore
					ctx.req.logout();
				}
			}
		});
		Object.defineProperty(ctx, 'isLogged', {
			get() {
				// @ts-ignore
				return !!ctx.req.user;
			}
		});
		await new Promise(resolve => {
			//@ts-ignore
			init(new Mock(ctx, ctx.req), new Mock(ctx, ctx.res), resolve);
		});
		await new Promise(resolve => {
			//@ts-ignore
			session(new Mock(ctx, ctx.req), new Mock(ctx, ctx.res), resolve);
		});
	};
}
export function authenticate(strategy: string, options: any={}) {
	let data = Object.assign({}, {assignProperty:'user'}, options );
	let args = [strategy, data]; // .filter(f => f);
	return async function (ctx: KaenContext) {
		await new Promise((resolve, reject) => {
			console.log('authenticating');
			_passport.authenticate(...args)(new Mock(ctx, ctx.req), new Mock(ctx, ctx.res), async function (err){
				await ctx.login(ctx.state.user);
				err ? reject(err) : resolve();
				//@ts-ignore
				// ctx.state.user = ctx.req.user;
			});
		});
	}
}
