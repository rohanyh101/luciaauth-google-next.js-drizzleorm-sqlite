"use server";

import type { z } from "zod";
import type { SignUpSchema } from "./SignUpForm";
import type { SignInSchema } from "./SignInForm";
import { db } from "@/drizzle/database";
import { UserTable } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient } from "@/lib/googleOauth";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
	try {
		// if user already exists, throw an error
		const quser = await db
			.select()
			.from(UserTable)
			.where(eq(UserTable.email, sql.placeholder("email")))
			.prepare();

		const user = quser.get({ email: values.email });

		if (user) {
			return { error: "User already exists", success: false };
		}

		const hashPassword = await bcrypt.hash(values.password, 11);

		const u = await db
			.insert(UserTable)
			.values({
				id: uuidv4(),
				email: values.email,
				name: values.name,
				password: hashPassword,
			})
			.returning({
				userId: UserTable.id,
			});

		const session = await lucia.createSession(u.at(0)?.userId as string, {});
		const sessionCookie = await lucia.createSessionCookie(session.id);

		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		return { success: true };
	} catch (error) {
		return { error: "Something went wrong", success: false };
	}
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
	try {
		const quser = await db
			.select()
			.from(UserTable)
			.where(eq(UserTable.email, sql.placeholder("email")))
			.prepare();

		const user = quser.get({ email: values.email });

		if (!user) {
			return { error: "invalid email or password", success: false };
		}

		// "!user.password" this is bcs, once user signed up with google, he must login with google only
		// bcs the password field is empty for google users  
		if (!user.password) {
			return { error: "invalid credentials", success: false };
		}

		const match = await bcrypt.compare(
			values.password,
			user.password as string,
		);

		if (!match) {
			return { error: "invalid email or password", success: false };
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = await lucia.createSessionCookie(session.id);

		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);

		return { success: true };
	} catch (error) {
		return { error: "Something went wrong", success: false };
	}
};

export const logout = async () => {
	const sessionCookie = await lucia.createBlankSessionCookie();
	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	// return redirect("/authenticate")
};

export const getGoogleOAuthConsentUrl = async () => {
	try {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();

		cookies().set("state", state, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		});

		cookies().set("codeVerifier", codeVerifier, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		});

		// console.log("state:", state)
		// console.log("codeVerifier:", codeVerifier)

		const authUrl = await googleOAuthClient.createAuthorizationURL(
			state,
			codeVerifier,
			{
				scopes: ["email", "profile"],
			},
		);

		return { success: true, url: authUrl.toString() };
	} catch (error) {
		return { success: false };
	}
};
