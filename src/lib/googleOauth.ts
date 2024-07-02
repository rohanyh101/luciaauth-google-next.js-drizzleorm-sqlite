import { Google } from 'arctic'

export const googleOAuthClient = new Google(
    process.env.GOOGLE_CLIENT_ID as string,
    process.env.GOOGLE_CLIENT_SECRET as string,
    `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`
)