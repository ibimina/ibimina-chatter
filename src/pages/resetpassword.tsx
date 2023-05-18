import Link from 'next/link';
import styles from '../styles/signup.module.css';
function SignUp() {
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
								Reset your password
							</p>
							<p className={`text-base  text-slate-400`}>
								Enter your email assoicated with your account and we will send
								you a link to reset your password{' '}
							</p>
						</div>
						<form className={`mb-10`}>
							<label className={`block mb-4`}>
								<input
									type='email'
									placeholder='Enter your email'
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
			</main>
		</>
	);
}

export default SignUp;
