import Link from 'next/link';
import styles from '../styles/index.module.css';
import { useState } from 'react';
import { useGoogleSignin, useGitHubSignin, useLogin } from '@/hooks';
import { useRouter } from 'next/router';
import Head from 'next/head';
import RegistrationLayout from '@/container/registerlayout';
import Image from 'next/image';
import { ShowPassword } from '@/components';


export default function Home() {
	const router = useRouter()
	const [loginDetails, setLoginDetails] = useState({
		email: '',
		password: '',
	});
	const [emailExists, setEmailExists] = useState<boolean | null>(null);
	const [passwordLimit, setPasswordLimit] = useState<boolean | null>(null);
	const { loginUser, error, isLoading } = useLogin();
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginDetails({
			...loginDetails,
			[e.target.name]: e.target.value,
		});
	};
	const { google } = useGoogleSignin();
	const { github } = useGitHubSignin()
	const handleGithubLogin = async (e: React.MouseEvent) => {
		e.preventDefault()
		await github();
	};
	const handleGoogleLogin = async (e: React.MouseEvent) => {
		e.preventDefault()
		await google();
	};
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await loginUser(loginDetails)

		if (error == "Firebase: Error (auth/user-not-found).") {
			setEmailExists(false)
			setPasswordLimit(false)
		} else if (error == "Firebase: Error (auth/wrong-password).") {
			setEmailExists(true)
			setPasswordLimit(false)
		} else if (error === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
			setEmailExists(null)
			setPasswordLimit(true)
		} else {
			router.push("/chatter")
		}
	}

	return (
		<>
			<Head>
				<title>Log in on InkSpire</title>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta http-equiv="X-UA-Compatible" content="IE=7" />
				<meta name="description" content="Log in to your account" />
			</Head>

			<RegistrationLayout>
				<div className='mt-20 lg:w-3/5 lg:m-auto md:mt-0 '>
					<div
						className={`pb-2 flex flex-col justify-center`}>
						<div className={`mb-8`}>
							<p className={`font-semibold text-3xl mb-2`}>Welcome back</p>
							<p className={`text-base  text-slate-400`}>
								Let&apos;s get you logged in so you can jump right back into
								sharing your brilliant ideas and engaging stories{' '}
							</p>
						</div>
						<form className={` mb-10`} onSubmit={handleLogin}>
							{passwordLimit && <p className={`text-red-500`}>You have exceeded the login limit. Please wait a few minutes and try again.</p>}
							<label className={`block mb-4`}>
								{emailExists === false && <p className={`text-red-500`}>Wrong email</p>}
								<input
									onChange={handleChange}
									name='email'
									type='email'
									placeholder='Enter your email'
									required
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								/>
							</label>
							<label className={`block mb-3 relative`}>
								{emailExists && <p className={`text-red-500`}>Wrong password</p>}
								<input
									onChange={handleChange}
									name='password'
									type='password'
									placeholder='Enter your password'
									required
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								/>
							<ShowPassword />
							</label>
							<Link
								href='forgotpassword'
								className={`block text-right mb-8 text-violet-700`}>
								forgot password
							</Link>
							<input
								disabled={isLoading}
								type='submit'
								value='Log in'
								className={`cursor-pointer mb-2 block w-full p-2 bg-violet-700 text-white rounded-lg hover:bg-black hover:text-white ${isLoading && 'opacity-50'}}`}
							/>
							<p className={`text-center`}>
								Don&apos;t have an account?{' '}
								<Link href='signup' className='text-violet-700'>Create one</Link>{' '}
							</p>
						</form>
						<p className={`mb-7`}>or continue with ______________</p>
						<div className={`flex items-center justify-center gap-4`}>
							<button
								onClick={handleGoogleLogin}
								className={`${styles.loginBtn}  ${styles.googleBtn} focus:border-solid hover:border-dashed rounded-full`}
								aria-label='google login button'
							></button>
							<button
								onClick={handleGithubLogin}
								className={`${styles.loginBtn}  ${styles.githubBtn} focus:border-solid hover:border-dashed rounded-full`}
								aria-label='github login button'
							></button>
						</div>
					</div>
				</div>
			</RegistrationLayout>
		</>
	);
}
