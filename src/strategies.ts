import { configuration } from '@kaenjs/core/configuration';
import * as _passport from 'passport';
import { PassportConfiguration } from './configuration';
const { Strategies } = configuration.passport as PassportConfiguration;
/** register the strategies to passport */
for (const { Strategy, Options, Auth } of Strategies) {
	let args = [Options, Auth].filter(f => f);
	// @ts-ignore
	_passport.use(new Strategy(...args));
}
