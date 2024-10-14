import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };