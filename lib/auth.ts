import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { account, session, user, verification } from "@/db/schema/auth";
import { userRoles } from "@/db/schema/user-roles";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user: user,
            account: account,
            session: session,
            verification: verification,
        }
    }),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        }
    },
    account: {
        accountLinking: {
            enabled: false,
        },
    },
    callbacks: {
        async session({ session, user }) {
            // Fetch user role from userRoles table
            if (user?.id) {
                const userRole = await db.select()
                    .from(userRoles)
                    .where(eq(userRoles.userId, user.id))
                    .limit(1);

                return {
                    ...session,
                    user: {
                        ...session.user,
                        role: userRole[0]?.role || 'USER',
                        regionId: userRole[0]?.regionId || null,
                    }
                };
            }

            return {
                ...session,
                user: {
                    ...session.user,
                    role: 'USER',
                    regionId: null,
                }
            };
        }
    }
});