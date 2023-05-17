import Link from "next/link";
import styles from "../styles/signup.module.css";
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
                Create your account
              </p>
              <p className={`text-base  text-slate-400`}>
                Start crafting compelling blog posts that engage and captivate
                readers from the very beginning.{" "}
              </p>
            </div>
            <form className={`mb-10`}>
              <label className={`block mb-4`}>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
                />
              </label>
              <label className={`block mb-4`}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
                />
              </label>
              <label className={`block mb-3`}>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`outline-none block w-full p-2 border-solid border-2 border-black rounded-lg`}
                />
              </label>
              <input
                type="submit"
                value="Sign Up"
                className={`cursor-pointer mt-10 block w-full p-2 bg-slate-300 rounded-lg hover:bg-black hover:text-white `}
              />
              <p className={` text-center`}>
                Already have an account? <Link href="/">Log in</Link>{" "}
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default SignUp;
