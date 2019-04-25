import { configuration } from '@kaenjs/core/configuration';
import { hash } from './hash';
const { authentication: { UsernameKey, PassowrdKey, Model, SaltRounds, Keys, Session } } = configuration;
export async function RegisterUser(username: string, password: string, data: any) {
	const payload = Object.assign({}, data, {
		[PassowrdKey]: await hash(password)
	});
	return Model().findOrCreate({
		[UsernameKey]: username
	}, payload);
}