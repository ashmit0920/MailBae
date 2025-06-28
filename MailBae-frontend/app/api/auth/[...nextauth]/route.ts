import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Wait until tokens are available
      const expiresAt = account?.expires_at
        ? new Date(account.expires_at * 1000).toISOString()
        : null;
  
      // Send token data to your custom API route
      await fetch(`${process.env.NEXTAUTH_URL}/api/store_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          access_token: account?.access_token,
          refresh_token: account?.refresh_token,
          expires_at: expiresAt,
          scope: account?.scope,
          token_type: account?.token_type,
          id_token: account?.id_token
        })
      });
      return true;
    },

    async jwt({ token, account }) {

      if (account) {
        console.log('🔒 Account:', account); // to inspect

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        
        // const expiresAt = account.expires_at
        // ? new Date(account.expires_at * 1000).toISOString()
        // : null;
        

        // if (error) {
        //   console.error('❌ Failed to store Gmail token:', error);
        // } else {
        //   console.log('✅ Gmail token stored successfully');
        // }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
