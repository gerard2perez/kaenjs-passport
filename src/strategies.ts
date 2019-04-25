import * as _passport from 'passport';
import { configuration } from '@kaenjs/core/configuration';
const { authentication: { Strategies } } = configuration;
/** register the strategies to passport */
for (const { Strategy, Options, Auth } of Strategies) {
	let args = [Options, Auth].filter(f => f);
	// @ts-ignore
	_passport.use(new Strategy(...args));
}
