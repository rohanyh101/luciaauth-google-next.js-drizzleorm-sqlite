import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
const path = require("node:path");
import dotenv from 'dotenv';
dotenv.config();

const dbPath =
	process.env.NODE_ENV === "development"
		? "sqlite.db"
		: process.env.DB_PATH as string;

export const sqlite = new Database(dbPath);

export const db = drizzle(sqlite);
