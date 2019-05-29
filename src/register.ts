import { configuration } from '@kaenjs/core/configuration';
import { hash } from './hash';
import { PassportConfiguration } from './configuration';
const { UsernameKey, PassowrdKey, Model } = configuration.passport as PassportConfiguration;
export async function RegisterUser(username: string, password: string, data: any) {
	const payload = Object.assign({}, data, {
		[PassowrdKey]: await hash(password)
	});
	return Model().findOrCreate({
		[UsernameKey]: username
	}, payload);
}