import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { PropsWithChildren } from "react";
import ErrorBoundary from "~/components/error-boundary";
import Footer from "~/components/footer";

export const loader = async (args: LoaderFunctionArgs) => {
  const { sessionId } = await getAuth(args);

  if (!sessionId) {
    const returnUrl = new URL(args.request.url);
    throw redirect(`/sign-in?redirect_url=${returnUrl.pathname}`, {});
  }

  return null;
};

function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <main className="h-full w-full max-w-4xl mx-auto flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center">
        {children}
      </div>
      <div className="flex-none">
        <Footer />
      </div>
    </main>
  );
}

export default function () {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export { ErrorBoundary };
