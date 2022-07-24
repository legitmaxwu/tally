import "../styles/globals.css";

import type { AppProps } from "next/app";
import { Navbar } from "../components/Navbar";
import { ReactNode } from "react";
import clsx from "clsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("px-4 sm:max-w-3xl", className)}>{children}</div>;
}
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Container className="flex flex-col items-center w-full mx-auto h-screen">
        <Navbar />
        <div className="h-16"></div>
        <Component {...pageProps} />
      </Container>
      <Toaster />
    </QueryClientProvider>
  );
}

export default MyApp;
