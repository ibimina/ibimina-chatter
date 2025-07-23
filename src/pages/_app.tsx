import { FallbackRender } from '@/components';
import TanstackProvider from '@/context/tanstack-provider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	return (
		<ErrorBoundary FallbackComponent={FallbackRender} onReset={() => router.reload()} resetKeys={[router.asPath]} >
				<TanstackProvider>
					<Component {...pageProps} key={router.asPath} />
				</TanstackProvider>
				<Toaster richColors />
		</ErrorBoundary>
	);
}
