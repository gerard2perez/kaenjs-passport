import { KaenContext } from '@kaenjs/core';
import { configuration } from '@kaenjs/core/configuration';
import * as _session from 'express-session';
import * as _passport from 'passport';
import './serialization';
import './strategies';
import { Mock } from './mock';
export { authenticate } from './autenticate';
export { RegisterUser } from './register';
declare global {
	namespace KaenExtensible {
		interface KaenContext {
			isLogged:boolean
			login:(user:any)=>Promise<void>
			logout:()=>void
		}
	}
}

export * from './middleware';