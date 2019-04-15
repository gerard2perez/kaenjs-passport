import { hash as _hash } from 'bcrypt';
export function hash(password:string, SaltRounds:number=5) {
	return _hash(password, SaltRounds);
}
