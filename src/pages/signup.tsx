import Link from 'next/link';
import styles from '../styles/signup.module.css';
import useSignUp from '@/hooks/useSignUp';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/store/store';

function SignUp() {
	const [emailExists, setEmailExists] = useState<boolean | null>(null);
	const [isPasswordShort, setIsPasswordShort] = useState<boolean | null>(null);
	const { createUser, error, isLoading } = useSignUp();
	const { state } = useAuthContext();

	const router = useRouter();
	const { user } = state;
	const [userDetails, setUserDetails] = useState({
		username: '',
		email: '',
		password: '',
	});

	useEffect(() => {
		if (state?.user?.uid?.length! > 0) {
			router.push('/tags');
		}
	}, [router, state?.user, user]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
		if (isPasswordShort) {
			userDetails.password.length > 6;
			setIsPasswordShort(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await createUser(userDetails);
		if (
			error === 'FirebaseError: Firebase: Error (auth/email-already-in-use)'
		) {
			setEmailExists(true);
		} else if (
			error ===
			'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).'
		) {
			setIsPasswordShort(true);
		}
	};

	return (
		<>
			<main className={`lg:flex lg:flex-row-reverse`}>
				<section
					className={`hidden bg-slate-300 lg:w-full  lg:block lg:h-screen lg:basis-2/5 `}
				></section>
				<section className={`basis-3/5 p-8 pt-3`}>
					<h1 className={`text-3xl font-bold underline`}>Chatter</h1>
					<div
						className={`lg:w-3/5 lg:m-auto  flex flex-col justify-center ${styles.signupCard}`}
					>
						<div className={`mb-8`}>
							<p className={`font-semibold text-3xl mb-2`}>
								Create your account
							</p>
							<p className={`text-base  text-slate-400`}>
								Start crafting compelling blog posts that engage and captivate
								readers from the very beginning.{' '}
							</p>
						</div>
						<form className={`mb-10`} onSubmit={handleSubmit}>
							<label className={`block mb-4`}>
								<input
									type='text'
									name='username'
									placeholder='Enter your username'
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
									onChange={handleInputChange}
								/>
							</label>
							<label className={`block mb-4`}>
								<input
									onChange={handleInputChange}
									name='email'
									type='email'
									placeholder='Enter your email'
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								/>
								{emailExists && (
									<p className={`text-red-500 text-sm`}>Email already exists</p>
								)}
							</label>
							<label className={`block mb-3`}>
								{isPasswordShort && (
									<p className={`text-red-500 text-sm`}>
										Password should be at least 6 characters
									</p>
								)}
								<input
									type='password'
									name='password'
									placeholder='Enter your password'
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
									onChange={handleInputChange}
								/>
							</label>
							<input
								type='submit'
								value='Sign Up'
								className={`cursor-pointer mt-10 block w-full p-2 bg-slate-300 rounded-lg hover:bg-black hover:text-white ${isLoading ? styles.grey : ''
									} `}
								disabled={isLoading}
							/>
							<p className={` text-center`}>
								Already have an account? <Link href='/'>Log in</Link>{' '}
							</p>
						</form>
					</div>
				</section>
			</main>
		</>
	);
}

export default SignUp;
