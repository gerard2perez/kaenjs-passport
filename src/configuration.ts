import {Strategy} from 'passport';
import {SessionOptions} from 'express-session';
import { Mut } from '@kaenjs/core/configuration/helpers';

interface IStrategy {
	Strategy:Strategy
	Options:SessionOptions,
	Auth:any
}
export interface PassportConfiguration<T=any> {
	Model:(o?:any) => T
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
}
