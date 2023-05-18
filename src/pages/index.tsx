import Link from 'next/link';
import styles from '../styles/index.module.css';
import { useEffect } from 'react';
import { useAuthContext } from '@/store/store';
import { useRouter } from 'next/router';

export default function Home() {
	const { state } = useAuthContext();
	const router = useRouter();

	useEffect(() => {		
		if (state?.user?.uid?.length! > 0) {
			 router.push('/chatter');
		}
	}, [router, state.user]);

	return (
		<>
			<main className={`lg:flex lg:flex-row-reverse`}>
				<section
					className={`hidden bg-slate-300 lg:w-full  lg:block lg:h-screen lg:basis-2/5 `}
				></section>
				<section className={`basis-3/5 p-8 pt-3`}>
					<h1 className={`text-3xl font-bold underline`}>Chatter</h1>
					<div
						className={`lg:w-3/5 lg:m-auto lg:mt-7 flex flex-col justify-center ${styles.loginCard}`}
					>
						<div className={`mb-8`}>
							<p className={`font-semibold text-3xl mb-2`}>Welcome back</p>
							<p className={`text-base  text-slate-400`}>
								Let&apos;s get you logged in so you can jump right back into
								sharing your brilliant ideas and engaging stories{' '}
							</p>
						</div>
						<form className={` mb-10`}>
							<label className={`block mb-4`}>
								<input
									type='email'
									placeholder='Enter your email'
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								/>
							</label>
							<label className={`block mb-3`}>
								<input
									type='password'
									placeholder='Enter your password'
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								/>
							</label>
							<Link
								href='resetpassword'
								className={`block text-right mb-8 underline`}
							>
								forgot password
							</Link>
							<input
								type='submit'
								value='Log in'
								className={`cursor-pointer block w-full p-2 bg-slate-300 rounded-lg hover:bg-black hover:text-white`}
							/>
							<p className={`text-center`}>
								Don&apos;t have an account?{' '}
								<Link href='signup'>Create one</Link>{' '}
							</p>
						</form>
						<p className={`mb-10`}>or continue with ______________</p>
						<div className={`flex items-center justify-center gap-4`}>
							<button
								className={`${styles.loginBtn}  ${styles.googleBtn} focus:border-solid rounded-full hover:border-dashed rounded-full`}
								aria-label='google login button'
							></button>
							<button
								className={`${styles.loginBtn}  ${styles.githubBtn} focus:border-solid rounded-full hover:border-dashed rounded-full`}
								aria-label='github login button'
							></button>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
