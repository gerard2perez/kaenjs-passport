import './serialization';
import './strategies';
export { authenticate } from './autenticate';
export * from './middleware';
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