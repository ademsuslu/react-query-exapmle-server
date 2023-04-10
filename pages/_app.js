import "@/styles/globals.css";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "react-query";

export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <nav>
        <Link href="/">home page</Link>
      </nav>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
