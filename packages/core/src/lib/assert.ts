import { assert as assertateAssert } from "assertate";

export type AssertionError =
	| "ERR_ACCOUNT_UNDEFINED"
	| "ERR_ACCOUNT_ADDRESS_UNDEFINED"
	| "ERR_UNEXPECTED_RESULT"
	| "ERR_OPERATION_FAILED"
	| "ERR_ASSERT_TRUE";

function assert(condition: any, message?: AssertionError): asserts condition {
	return assertateAssert(condition, message);
}

export { assert };
