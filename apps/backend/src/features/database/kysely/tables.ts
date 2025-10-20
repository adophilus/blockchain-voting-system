import type { ColumnType } from "kysely";

type MediaDescription = {
	source: "sqlite";
	id: string;
};

type TimestampModel = {
	created_at: ColumnType<string, never, never>;
	updated_at: ColumnType<string | null, never, string>;
};

type UsersTable = (TimestampModel & {
	id: string;
	email: string;
}) &
	(
		| {
				role: "USER";
				first_name: string;
				last_name: string;
				profile_photo: string | null;
				address: string;
				private_key: string;
		  }
		| { role: "ADMIN" }
	);

type PositionsTable = TimestampModel & {
	id: string;
	title: string;
	description: string | null;
	election_id: string;
};

type CandidatesTable = TimestampModel & {
	id: string;
	name: string;
	bio: string | null;
	image: MediaDescription | null;
	position_id: string;
};

type VotersTable = TimestampModel & {
	id: string;
	first_name: string;
	last_name: string;
	profile_photo: string | null;
	email: string;
	address: string;
	private_key: string;
};

type VotesTable = {
	id: string;
	election_id: string;
	position_id: string;
	candidate_id: string;
	voter_id: string;
	created_at: ColumnType<string, never, never>;
};

type FilesTable = TimestampModel & {
	id: string;
	original_name: string;
	file_data: Buffer;
	mime_type: string;
};

export type KyselyDatabaseTables = {
	voters: VotersTable;
};
