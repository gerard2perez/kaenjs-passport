import {Strategy} from 'passport';
import { Mut } from '@kaenjs/core/configuration/helpers';

interface IStrategy {
	Strategy:Strategy
	Options:any,
	Auth:any
}
export interface PassportConfiguration<T=any> {
	Model:(o?:any) => T
	serialize?:(user:T)=>Promise<string>
	deserialize?:(id:string)=>Promise<T>
	/**
	 * These values are use to generate cookies
	 */
	UsernameKey:string
	PassowrdKey:string
	SaltRounds: number
	Strategies:Array<IStrategy>

}
export type IPassportConfiguration<T=any> = {
    UsernameKey:Mut<string>
	PassowrdKey:Mut<string>
    SaltRounds: Mut<number>
    Model:Mut<(o?:any) => T>
	Strategies:Array<IStrategy>
	serialize?:(user:T)=>Promise<string>
	deserialize?:(id:string)=>Promise<T>
}
