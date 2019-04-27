import { KaenContext } from '@kaenjs/core';
import { configuration } from '@kaenjs/core/configuration';
import * as _session from 'express-session';
import * as _passport from 'passport';
import { Mock } from './mock';

const { authentication: { Keys, Session } } = configuration;

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
function Passport(router?:any) {
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
export { _Session as Session, _passport as PassportInstance, Passport };
