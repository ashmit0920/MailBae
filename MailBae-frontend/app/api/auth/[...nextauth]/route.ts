import NextAuth, { NextAuthOptions, User, Account, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.modify',
          response_type: 'code',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
      // profile(profile) {
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture,
      //   };
      // },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: { user: User, account: Account | null, profile?: Profile }) {
      const user_id = user.email;
      if (!user_id) {
        console.error("No user email found during signIn");
        return false;
      }

      const expiresAt = account?.expires_at
        ? new Date(account.expires_at * 1000).toISOString()
        : null;

      try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/store_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id,
            access_token: account?.access_token,
            refresh_token: account?.refresh_token,
            expires_at: expiresAt,
            scope: account?.scope,
            token_type: account?.token_type,
            id_token: account?.id_token
          })
        });

        if (!res.ok) {
          const error = await res.json();
          console.error('Failed to store Gmail token:', error);
        } else {
          console.log('Gmail token stored successfully');
        }

      } catch (error) {
        console.error('Error storing Gmail token:', error);
      }
      return true;
    },

    async jwt({ token, account }: { token: JWT, account?: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },

    async session({ session, token }: { session: Session, token: JWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
