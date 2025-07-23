import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/forgotpassword.module.css';
import { useState } from 'react';
import Head from 'next/head';
import RegistrationLayout from '@/container/registerlayout';
import { useRouter } from 'next/router';
import { ShowPassword } from '@/components';



function ResetPassword() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>, email: string) => {
        e.preventDefault()
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
        if (passwordRegex.test(password)) {

            let actionCode = `${router?.query?.oobCode}`
            // verifyPasswordResetCode(firebaseAuth, actionCode).then((email) => {
            //     confirmPasswordReset(firebaseAuth, actionCode, password).then((resp) => {
            //         setSuccess(true)
            //         setError("")
            //     }).catch((error) => {
            //         if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
            //             setError("Password should be at least 6 characters")
            //         } else if (error.message === "Firebase: The password reset code has expired. (auth/expired-action-code).") {
            //             setError("The password reset code has expired")
            //         }
            //     });
            // }).catch((error) => {
            //     if (error.message === "Firebase: The password reset code has expired. (auth/expired-action-code).") {
            //         setError("The password reset code has expired, please request a new one from the forgot password page")
            //     }

            // });
        } else {
            setError("Password must contain a capital letter, number and special character")

        }
    }

    return (

        <>
            <Head>
                <title>Reset password - InkSpire</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=7" />
                <meta name="description" content="Enter a new password to retrieve your account" />
            </Head>

            <RegistrationLayout>
                <div
                    className={` lg:w-4/5 lg:m-auto  flex flex-col justify-center `}
                >
                    <div className={`mb-8`}>
                        <p className={`font-semibold text-3xl mb-2`}>
                            Create a new password
                        </p>
                        <p className={`text-base  text-slate-400`}>
                            Lets get you back into your account, enter a new password for your account
                        </p>
                    </div>
                    <form className={`mb-10`} onSubmit={(e) => handlePasswordReset(e, password)}>
                        <label className={`block mb-4 relative`}>
                            {error && <p className={`text-red-500 mb-2`}>{error}</p>}
                            <input
                                type='password'
                                placeholder='Enter a new password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value.trim())}
                                required
                                className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
                            />
                            <ShowPassword />
                        </label>
                        <input
                            type='submit'
                            value='Change password'
                            className={`cursor-pointer mt-10 block w-full p-2 bg-violet-700 text-white rounded-lg hover:bg-black hover:text-white `}
                        />
                        <p className={` text-center`}>
                            Already have an account? <Link href='/' className='text-violet-700'>Log in</Link>{' '}
                        </p>
                    </form>
                </div>
                {
                    success && <div className={`fixed top-0 left-0 flex items-center justify-center w-full h-full ${styles.backdrop} `}>
                        <div className={`bg-white text-black text-center py-5 px-5 ${styles.success}`}>
                            <p className={`mb-4 font-medium text-2xl`}>Password Reset successful</p>
                            <Image src="/images/icons8-check.svg" className={`mx-auto mb-4`} alt="check mark" width={80} height={70} />
                            <p className={`mb-6`}>Your password has been changed successfully</p>
                            <Link href="/" className='bg-violet-700 block px-2 py-4 text-white'>Go to login</Link>
                            <button onClick={() => setSuccess(false)} className={` ${styles.close}`} aria-label="close modal"></button>

                        </div>
                    </div>
                }

            </RegistrationLayout>

        </>
    );
}

export default ResetPassword;
