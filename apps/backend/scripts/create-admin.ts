import { AuthUserRepository } from "@/features/auth/repository";
import { hashPassword } from "@/features/auth/utils/password";
import { Container } from "@n8n/di";
import { bootstrap } from "@blockchain-voting-system/backend";
import { ulid } from "ulidx";

await bootstrap();

const adminPayload = {
	id: ulid(),
	email: "admin@university.edu",
	password_hash: await hashPassword("admin123"),
	full_name: "Admin",
	role: "ADMIN",
} as const;

const authUserRepository = Container.get(AuthUserRepository);

const createAdmin = async (authUserRepository: AuthUserRepository) => {
	const existingUserResult = await authUserRepository.findByEmail(
		adminPayload.email,
	);
	if (existingUserResult.isErr) {
		console.log("❌ Failed to check existing user");
		return;
	}

	const existingUser = existingUserResult.value;
	if (existingUser) {
		console.log("❌ Admin user already exists");
		return;
	}

	const res = await authUserRepository.create(adminPayload);

	if (res.isErr) {
		console.log(res.error);
		console.log("❌ Failed to create admin user");
		return;
	}

	console.log("✅ Admin user created");
};

await createAdmin(authUserRepository);
