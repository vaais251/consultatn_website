import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        // ─── Google OAuth ───────────────────────────────────
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),

        // ─── Email / Password ───────────────────────────────
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    return null;
                }

                // Users who signed up via Google don't have a passwordHash
                if (!user.passwordHash) {
                    return null;
                }

                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        // ─── Handle sign-in (auto-create Google users) ──────
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existingUser) {
                    // Auto-create user on first Google login
                    const newUser = await prisma.user.create({
                        data: {
                            name: user.name || "Google User",
                            email: user.email,
                            image: user.image,
                            role: "CLIENT",
                            clientProfile: {
                                create: {},
                            },
                        },
                    });

                    // Create the account link
                    await prisma.account.create({
                        data: {
                            userId: newUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refresh_token: account.refresh_token,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                            session_state: account.session_state as string | null,
                        },
                    });
                } else if (!existingUser.image && user.image) {
                    // Update image if user exists but has no image
                    await prisma.user.update({
                        where: { email: user.email },
                        data: { image: user.image },
                    });
                }
            }
            return true;
        },

        // ─── Enrich JWT with role + id ──────────────────────
        async jwt({ token, user }) {
            if (user) {
                // First login — user object comes from authorize() or Google
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email! },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            return token;
        },

        // ─── Expose role + id in session ────────────────────
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});
