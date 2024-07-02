import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "./database";

async function main() {
	await migrate(db, { migrationsFolder: "./src/drizzle/migrations" });

	sqlite.close();
}

main()
	.then(() => {
		console.log("Migration successful!");
	})
	.catch(() => {
		console.log("Migration failed!");
	});
