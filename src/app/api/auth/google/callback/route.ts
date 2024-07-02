import { db } from "@/drizzle/database";
import { UserTable } from "@/drizzle/schema";
import { googleOAuthClient } from "@/lib/googleOauth";
import { lucia } from "@/lib/lucia";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// will hit the endpoint http://localhost:3000/api/auth/google/callback
export async function GET(req: NextRequest, res: NextResponse) {
	const url = req.nextUrl;
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	if (!code || !state) {
		console.log("no code or state");
		return new Response("invalid request", { status: 400 });
	}

	const codeVerifier = cookies().get("codeVerifier")?.value;
	const sessionState = cookies().get("state")?.value;

	if (!codeVerifier || !sessionState) {
		console.log("no code_verifier or state");
		return new Response("invalid request", { status: 400 });
	}

	if (state !== sessionState) {
		console.log("state mismatch");
		return new Response("invalid request", { status: 400 });
	}

	const { accessToken } = await googleOAuthClient.validateAuthorizationCode(
		code,
		codeVerifier,
	);

	const googleResponse = await fetch(
		"https://www.googleapis.com/oauth2/v1/userinfo",
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);

	const googleData = (await googleResponse.json()) as {
		id: string;
		email: string;
		name: string;
		picture: string;
	};

	let userId = "";

	const quser = await db
		.select()
		.from(UserTable)
		.where(eq(UserTable.email, sql.placeholder("email")))
		.prepare();

	const user = quser.get({ email: googleData.email });
	userId = user?.id as string;

	// if the email does not exist, then create a new user and sign them in...
	if (!user) {
		const newUser = await db
			.insert(UserTable)
			.values({
				id: uuidv4(),
				email: googleData.email,
				name: googleData.name,
				picture: googleData.picture,
			})
			.returning({
				userId: UserTable.id,
			});

		userId = newUser.at(0)?.userId as string;
	}

	// if email already exists, then create a new cookie for user and sign them in...
	const session = await lucia.createSession(userId, {});
	const sessionCookie = await lucia.createSessionCookie(session.id);

	cookies().set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	redirect("/dashboard");
}
