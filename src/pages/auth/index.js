import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, getRedirectResult } from 'firebase/auth'
import { logEvent } from 'firebase/analytics'

import useFirebase from '../../hooks/useFirebase'
import useToggle from '../../hooks/useToggle'
import EnvelopeIcon from '../../assets/icons/EnvelopeIcon'
import LockIcon from '../../assets/icons/LockIcon'
import AuthInput from '../../components/Auth/AuthInput'
import OtherAuthMethods from '../../components/Auth/OtherAuthMethods'

// this would need to be split imo it's way too big of a file
const Auth = () => {
  const [isUserLoggingIn, toggleIsUserLoggingIn] = useToggle(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { auth, analytics } = useFirebase()
  const router = useRouter()

  const loginOrSignupText = isUserLoggingIn ? 'Login' : 'Sign Up'

  // this is for handling the redirect, again, you can probably do this a better way, but I haven't put in the time to find it yet
  useEffect(() => {
    if (auth) {
      getRedirectResult(auth)
        .then(res => {
          if (res && res.user) {
            const { isNewUser } = res._tokenResponse
            const eventName = isNewUser ? 'sign_up' : 'login'
            
            logEvent(analytics, eventName, { method: 'Google' })
            router.push('/dashboard')
          }
        })
        .catch(err => console.error('GET REDIRECT', err))
    }
  }, [auth, analytics, router])

  //this is for the default email and password fields
  const onSubmitHandler = async e => {
    e.preventDefault()

    try {
      if (isUserLoggingIn) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(user)
      }

      const eventName = isUserLoggingIn ? 'login' : 'sign_up'
      logEvent(analytics, eventName, { method: 'emailAndPassword' })

      router.push('/dashboard')
    } catch (err) {
      console.log(err)
      switch(err.code) {
        case 'auth/user-not-found' | 'auth/wrong-password':
          setError('Invalid email or password')
        case 'auth/email-already-in-use':
          setError('A user with that email already exists')
      }
    }
  }

  // this is the way I go about making inputs generally- it allows me to easily add more if ever needed, and I can change the code in one place
  const inputs = [
    {Icon: EnvelopeIcon, type: 'email', label: 'Email', value: email, setState: setEmail, autoComplete: 'email'},
    {Icon: LockIcon, alt: 'Lock Icon', type: 'password', label: 'Password', value: password, setState: setPassword, autoComplete: isUserLoggingIn ? 'current-password' : 'new-password'}
  ]



  return (
    <>
      <Head>
        <title>{loginOrSignupText}</title>
        <meta name="description" content="Login or Signup to Budgewit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center w-screen h-screen bg-white dark:bg-black">
        <section className="flex flex-col items-center">
          <div className="px-12 py-8 bg-gray-200 sm:p-12 rounded-xl dark:bg-gray-800">
            <fieldset>
              <legend className="mb-1 text-2xl font-medium text-gray-800 sm:mb-2 dark:text-gray-100">
                {isUserLoggingIn ? 'Login to Budgewit' : 'Welcome to Budgewit!'}
              </legend>
              <form onSubmit={onSubmitHandler}>
                <div className="flex flex-col">
                  {inputs.map(input => <AuthInput input={input} />)}
                </div>
                <div className="flex flex-col-reverse items-center mt-6 sm:flex-row sm:items-end sm:justify-between sm:mt-8">
                  {isUserLoggingIn && (
                    <Link href="/auth/forgot-password">
                      <a className="text-sm text-gray-700 bg-transparent cursor-pointer dark:text-gray-400 hover:underline">
                        Forgot your password?
                      </a>
                    </Link>
                  )}
                  <button 
                    type="submit"
                    className={`bg-green-500 transition-width w-full ${isUserLoggingIn ? 'sm:w-4/12' : ''} mb-2 sm:mb-0 px-8 py-2 rounded-md text-white text-md font-medium dark:bg-green-600 focus:outline-none focus:bg-green-800 active:bg-green-800 hover:bg-green-800`}
                  >
                    {loginOrSignupText}
                  </button>
                </div>
              </form>
            </fieldset>
          </div>
          <div className="flex flex-row mt-4">
            <p className="mr-2 text-sm text-gray-900 dark:text-gray-200">
              {isUserLoggingIn ? 'Need an account?' : 'Already have an account?'}
            </p>
            <input 
              type="button" 
              className="text-sm font-semibold text-green-500 bg-transparent cursor-pointer dark:text-green-400 hover:underline active:underline active:outline-none focus:outline-none active:text-gray-200"
              value={isUserLoggingIn ? 'Sign up' : 'Login'} 
              onClick={toggleIsUserLoggingIn}
            />
          </div>
          <OtherAuthMethods />
        </section>
      </main>
    </>
  )
}

export default Auth
