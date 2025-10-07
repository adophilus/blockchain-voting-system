import { assert as assertateAssert } from "assertate";

export type AssertionError =
	| "ERR_ACCOUNT_UNDEFINED"
	| "ERR_ACCOUNT_ADDRESS_UNDEFINED";

function assert(condition: any, message?: AssertionError): asserts condition {
	return assertateAssert(condition, message);
}

export { assert };
