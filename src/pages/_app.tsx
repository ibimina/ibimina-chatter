import { FallbackRender } from '@/components';
import { AuthContextProvider } from '@/store/reducer';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ErrorBoundary } from "react-error-boundary";

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	return (
		<ErrorBoundary FallbackComponent={FallbackRender} onReset={() => router.reload()} resetKeys={[router.asPath]} >
			<AuthContextProvider>
				<Component {...pageProps} key={router.asPath} />
			</AuthContextProvider>
		</ErrorBoundary>
	);
}
