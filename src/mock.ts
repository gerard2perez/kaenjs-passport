import { KaenContext } from "@kaenjs/core";

export class Mock {
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