import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, useAuth } from "@clerk/remix";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import tailwind from "./tailwind.css?url";

import { PropsWithChildren, useEffect, useState } from "react";
import { PostHogProvider, usePostHog } from "posthog-js/react";
import { themeSessionResolver } from "./sessions.server";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { Toaster } from "./components/ui/toaster";
import invariant from "tiny-invariant";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

export const loader = async (args: LoaderFunctionArgs) => {
  return await rootAuthLoader(args, async ({ request }) => {
    // const { sessionId, userId, getToken } = request.auth;
    const { getTheme } = await themeSessionResolver(request);

    invariant(process.env.CONVEX_URL, "CONVEX_URL is required");

    return {
      theme: getTheme(),

      ENV: {
        POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
        POSTHOG_HOST: process.env.POSTHOG_HOST,
        CONVEX_URL: process.env.CONVEX_URL,
      },
    };
  });
};

export const useRootLoaderData = () =>
  useRouteLoaderData<typeof loader>("root");

function Layout({ children }: { children: React.ReactNode }) {
  const data = useRootLoaderData();
  const [theme] = useTheme();
  const posthog = usePostHog();
  const location = useLocation();

  useEffect(() => {
    posthog.capture("$pageview");
  }, [posthog, location]);

  return (
    <html lang="en" data-theme={theme} className={theme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
        <Scripts />
      </body>
    </html>
  );
}

function Providers({ children }: PropsWithChildren<unknown>) {
  const { theme, ENV } = useLoaderData<typeof loader>();
  const [convexClient] = useState(new ConvexReactClient(ENV.CONVEX_URL));

  return (
    <PostHogProvider
      apiKey={ENV.POSTHOG_API_KEY}
      options={{
        api_host: ENV.POSTHOG_HOST,
        person_profiles: "identified_only",
      }}
    >
      <ThemeProvider specifiedTheme={theme} themeAction="/action/set-theme">
        <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ThemeProvider>
    </PostHogProvider>
  );
}

function App() {
  return (
    <Providers>
      <Layout>
        <Outlet />
      </Layout>
    </Providers>
  );
}

export default ClerkApp(App);
