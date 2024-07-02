import { Lucia } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '@/drizzle/database';
import { SessionTable, type TypeNewUserTable, UserTable } from '@/drizzle/schema';
import dotenv from 'dotenv';
import { cookies } from 'next/headers';
import { eq, sql } from 'drizzle-orm';
dotenv.config();

const adapter = new DrizzleSQLiteAdapter(db, SessionTable, UserTable);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        name: "user_session",
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    }  
})

export const getUser = async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) return null;

    // console.log("Session ID:", sessionId);

    const { session, user } = await lucia.validateSession(sessionId);
    console.log("Session:", session);
    console.log("User:", user);

    try {
        if (session && !session.fresh) {
            // refresh the session
            const sessionCookie = await lucia.createSessionCookie(session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }

        if (!session) {
            const sessionCookie = await lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
    } catch (error) {
        console.error(error);
        // return { error: "Something went wrong" };
    }

    const quser = await db
			.select({
                Name: UserTable.name,
                Email: UserTable.email,
                Picture: UserTable.picture,
            })
			.from(UserTable)
			.where(eq(UserTable.id, sql.placeholder("id")))
			.prepare();

		const nUser = quser.get({ id: user?.id });

        return nUser as {
            Name: string;
            Email: string;
            Picture: string;
        };
}