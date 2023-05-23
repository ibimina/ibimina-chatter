import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/forgotpassword.module.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from '@/firebase/config';
import { useState } from 'react';


function ForgotPassword() {
	const [emailSent, setEmailSent] = useState(false)
	const [invalidEmail, setInvalidEmail] = useState(false)
	const [email, setEmail] = useState("")
	const handlePasswordResetMail = (e: React.FormEvent<HTMLFormElement>, email: string) => {
		e.preventDefault()
		if (email.length > 0) {
			sendPasswordResetEmail(firebaseAuth, email)
				.then(() => {
					// Password reset email sent!
					// ..
					setInvalidEmail(false)
					setEmailSent(true)
					setEmail("")
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(error)
					setInvalidEmail(true)
					// ..
				});
		}

	}
	return (

		<>
			<main className={`lg:flex lg:flex-row-reverse`}>
				<section
					className={`hidden bg-slate-300 lg:w-full  lg:block lg:h-screen lg:basis-2/5 `}
				></section>
				<section className={`basis-3/5 p-8 pt-3`}>
					<h1 className={`text-3xl font-bold underline mb-9`}>Chatter</h1>
					<div
						className={`lg:w-3/5 lg:m-auto  flex flex-col justify-center ${styles.signupCard}`}
					>
						<div className={`mb-8`}>
							<p className={`font-semibold text-3xl mb-2`}>
								Reset your password
							</p>
							<p className={`text-base  text-slate-400`}>
								Enter your email assoicated with your account and we will send
								you a link to reset your password{' '}
							</p>
						</div>
						<form className={`mb-10`} onSubmit={(e) => handlePasswordResetMail(e, email)}>
							<label className={`block mb-4`}>
								{invalidEmail && <p className={`text-red-500`}> User doesn&apos;t exiist</p>}
								<input
									type='email'
									placeholder='Enter your email'
									value={email}
									onChange={(e) => setEmail(e.target.value.trim())}
									required
									className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
								/>
							</label>
							<input
								type='submit'
								value='Submit Email'
								className={`cursor-pointer mt-10 block w-full p-2 bg-slate-300 rounded-lg hover:bg-black hover:text-white `}
							/>
							<p className={` text-center`}>
								Already have an account? <Link href='/'>Log in</Link>{' '}
							</p>
						</form>
					</div>
				</section>
				{
					emailSent &&
					<div className={`fixed top-0 flex items-center justify-center w-full h-full ${styles.backdrop}`}>
						<div className={`bg-white text-black text-center py-5 px-2 ${styles.success}`}>
								<p className={`mb-2`}>Email has been sent</p>
								<Image src="/images/icons8-received-96.png" className={`mx-auto mb-2`} alt="email sent" width={80} height={70}/>
							<p>Please check your inbox and click in the received link to reset a password</p>
							<button onClick={() => setEmailSent(false)} className={` ${styles.close}`} aria-label="close modal"></button>
						</div>
					</div>
				}
			</main>
		</>
	);
}

export default ForgotPassword;
