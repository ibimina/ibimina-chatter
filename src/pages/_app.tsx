import { AuthContextProvider } from '@/store/reducer';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	return (
		<AuthContextProvider>
			<Component {...pageProps} key={router.asPath }/>
		</AuthContextProvider>
	);
}
