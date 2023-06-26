import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/signup.module.css';
import useSignUp from '@/hooks/useSignUp';
import { useState } from 'react';
import RegistrationLayout from '@/container/registerlayout';


function SignUp() {
	const [emailExists, setEmailExists] = useState<boolean | null>(null);
	const [isPasswordShort, setIsPasswordShort] = useState<boolean | null>(null);
	const { createUser, error, isLoading } = useSignUp();

	const [userDetails, setUserDetails] = useState({
		username: '',
		email: '',
		password: '',
		topics: [],
	});
	interface FormErrors {
		email?: string;
		name?: string;
		password?: string;
	}
	const [formErrors, setFormErrors] = useState<FormErrors[]>([]) // ["Invalid email", "Username should be at least 3 characters"
	const validateForm = () => {
		let validEmailpattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!validEmailpattern.test(userDetails.email)) {
			setFormErrors([...formErrors, { email: "Invalid email" }])
		} if (userDetails.username.length < 3) {
			setFormErrors([...formErrors, { name: "Username should be at least 3 characters" }])
		} if (userDetails.password.length < 6) {
			setFormErrors([...formErrors, { password: "Password should be at least 6 characters" }])
		}
		if (formErrors.length > 0) {
			return false
		} else {
			return true
		}
	};


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
		if (isPasswordShort) {
			userDetails.password.length > 6;
			setIsPasswordShort(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateForm()) {
			return
		}else{
			await createUser(userDetails);
		}

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
			<Head>
				<title>Sign up on InkSpire</title>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta http-equiv="X-UA-Compatible" content="IE=7" />
				<meta name="description" content="Create a account on InkSpire" />
			</Head>
			<RegistrationLayout>
				<div
					className={`lg:w-3/5 lg:m-auto flex flex-col justify-center`}
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
								required
								placeholder='Enter your username'
								className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								onChange={handleInputChange}
							/>
							{
								formErrors.map((error, index) => {
									if (error.name) {
										return <p key={index} className={`text-red-500 text-sm`}>{error.name}</p>
									}
								})
							}
						</label>
						<label className={`block mb-4`}>
							<input
								onChange={handleInputChange}
								name='email'
								type='email'
								placeholder='Enter your email'
								required
								className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
							/>
							{
								formErrors.map((error, index) => {
									if (error.email) {
										return <p key={index} className={`text-red-500 text-sm`}>{error.email}</p>
									}
								})
							}
							{emailExists && (
								<p className={`text-red-500 text-sm`}>Email already exists</p>
							)}
						</label>
						<label className={`block mb-3`}>
							{
								formErrors.map((error, index) => {
									if (error.password) {
										return <p key={index} className={`text-red-500 text-sm`}>{error.password}</p>
									}
								})
							}
							{isPasswordShort && (
								<p className={`text-red-500 text-sm`}>
									Password should be at least 6 characters
								</p>
							)}
							<input
								type='password'
								name='password'
								required
								placeholder='Enter your password'
								className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								onChange={handleInputChange}
							/>
						</label>
						<input
							type='submit'
							value='Sign Up'
							className={`cursor-pointer mt-10 block w-full p-2 bg-violet-700 text-white rounded-lg hover:bg-black hover:text-white ${isLoading ? styles.grey : ''
								} `}
							disabled={isLoading}
						/>
						<p className={` text-center`}>
							Already have an account? <Link href='/'>Log in</Link>{' '}
						</p>
					</form>
				</div>
			</RegistrationLayout>
			
		</>
	);
}

export default SignUp;
