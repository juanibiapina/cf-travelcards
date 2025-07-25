import { Hono } from "hono";
import { logger } from "hono/logger";
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Google from '@auth/core/providers/google'
import { handleMockSignIn } from './test-helpers'
import { partyserverMiddleware } from "hono-party";
import { persistUser, getUserById, getUserByEmail } from "./user";
import * as Sentry from "@sentry/cloudflare";
import { HTTPException } from "hono/http-exception";
import { UsersDO } from "./UsersDO";

export interface Env {
  DATABASE_URL: string;
  AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  MOCK_AUTH?: string;
  SENTRY_DSN?: string;
  ENVIRONMENT?: string;
  CF_VERSION_METADATA?: {
    id: string;
  };
  ACTIVITYDO: DurableObjectNamespace;
  USERSDO: DurableObjectNamespace<UsersDO>;
}

const app = new Hono<{ Bindings: Env }>()
  .onError((err, c) => {
    Sentry.captureException(err);

    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    return c.json({ error: "Internal server error" }, 500);
  });

app.use(logger());

app.use( "*", partyserverMiddleware({ onError: (error) => console.error(error) }));

app.use(
  '*',
  initAuthConfig((c) => ({
    basePath: '/api/auth',
    secret: c.env.AUTH_SECRET,
    providers: [
      Google({
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
        // The following block is useful for testing the entire flow in development
        //authorization: {
        //  params: {
        //    prompt: "consent",
        //  },
        //},
      }),
    ],
    callbacks: {
      async signIn({ user, profile }) {
        // Persist user when they sign in
        if (user.email) {
          await persistUser(c.env, user, profile);
        }
        return true;
      },
      async session({ session }) {
        // Enrich session.user with the database user id
        if (session.user && session.user.email) {
          const user = await getUserByEmail(c.env, session.user.email);
          if (user) {
            session.user.id = user.id.toString();
          }
        }
        return session;
      },
    },
  }))
);

// Test-only mock authentication endpoint (must be before authHandler)
app.post('/api/auth/test-signin', handleMockSignIn);

app.use('/api/auth/*', authHandler())

// Verify authentication for all API routes
app.use('/api/*', verifyAuth())

app.get('/api/users/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid user ID' }, 400);
  }
  const user = await getUserById(c.env, id);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }
  return c.json({
    id: user.id.toString(),
    name: user.name,
    profileImage: user.picture || null,
  });
});

export default Sentry.withSentry(
  (env: Env) => {
    const environment = env.ENVIRONMENT || 'development';
    const { id: versionId } = env.CF_VERSION_METADATA || { id: 'unknown' };

    return {
      // Disable Sentry in development by not setting DSN
      dsn: environment === 'development' ? undefined : env.SENTRY_DSN,
      environment,
      release: versionId,
      sendDefaultPii: true,
      tracesSampleRate: 1.0,
    };
  },
  app,
);
export { ActivityDO } from "./ActivityDO";
export { UsersDO } from "./UsersDO";
