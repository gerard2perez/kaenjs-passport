import { compare as _compare } from 'bcrypt';
export function compare(password:string, encrypted:string) {
	return _compare(password, encrypted);
}
