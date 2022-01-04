import Head from 'next/head'
import useToggle from '../../hooks/useToggle'
import OtherAuthMethods from '../../components/Auth/OtherAuthMethods'
import AuthForm from '../../components/Auth/AuthForm';

const Auth = () => {
  const [isNewUser, toggleIsNewUser] = useToggle(true)

  return (
    <>
      <Head>
        <title>{isNewUser ? 'Login' : 'Sign Up'}</title>
        <meta name="description" content="Login or Signup to Budgewit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center w-screen h-screen bg-white dark:bg-black">
        <section className="flex flex-col items-center">
          <div className="px-12 py-8 bg-gray-200 sm:p-12 rounded-xl dark:bg-gray-800">
            <fieldset>
              <legend className="mb-1 text-2xl font-medium text-gray-800 sm:mb-2 dark:text-gray-100">
                {isNewUser ? 'Login to Budgewit' : 'Welcome to Budgewit!'}
              </legend>
              <AuthForm isNewUser={isNewUser} />
            </fieldset>
          </div>
          <div className="flex flex-row mt-4">
            <p className="mr-2 text-sm text-gray-900 dark:text-gray-200">
              {isNewUser ? 'Need an account?' : 'Already have an account?'}
            </p>
            <input 
              type="button" 
              className="text-sm font-semibold text-green-500 bg-transparent cursor-pointer dark:text-green-400 hover:underline active:underline active:outline-none focus:outline-none active:text-gray-200"
              value={isNewUser ? 'Sign up' : 'Login'} 
              onClick={toggleIsNewUser}
            />
          </div>
          <OtherAuthMethods />
        </section>
      </main>
    </>
  )
}

export default Auth
