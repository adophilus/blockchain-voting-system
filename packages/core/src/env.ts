import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
	server: {
		PRIVATE_KEY: z.string().startsWith("0x"),
	},
	runtimeEnv: process.env,
});

export { env };
