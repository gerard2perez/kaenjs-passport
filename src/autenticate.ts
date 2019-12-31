import { KaenContext } from '@kaenjs/core';
import * as _passport from 'passport';
import { Mock } from './mock';
export function authenticate(strategy: string, options: any={}) {
	let data = Object.assign({}, {assignProperty:'user'}, options );
	let args = [strategy, data];
	return async function (ctx: KaenContext) {
		await new Promise((resolve, reject) => {
			// @ts-ignore
			_passport.authenticate(...args)(new Mock(ctx, ctx.req), new Mock(ctx, ctx.res), async function (err){
				await ctx.login(ctx.state.user);
				err ? reject(err) : resolve();
			});
		});
	}
}
