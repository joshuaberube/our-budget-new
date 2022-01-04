import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, sendEmailVerification, getRedirectResult } from 'firebase/auth'
import { logEvent } from 'firebase/analytics'

import useFirebase from '../../hooks/useFirebase'
import useToggle from '../../hooks/useToggle'
import EnvelopeIcon from '../../assets/icons/EnvelopeIcon'
import LockIcon from '../../assets/icons/LockIcon'
import EyeIcon from '../../assets/icons/EyeClosedIcon'
import GoogleLogoIcon from '../../assets/icons/GoogleLogoIcon'

const Auth = () => {
  const [isUserLoggingIn, toggleIsUserLoggingIn] = useToggle(true)
  const [isPasswordVisible, toggleIsPasswordVisible] = useToggle(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { auth, analytics } = useFirebase()
  const router = useRouter()

  const loginOrSignupText = isUserLoggingIn ? 'Login' : 'Sign Up'

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

  const googleSignInTest = async () => {
    const provider = new GoogleAuthProvider()

    try {
      signInWithRedirect(auth, provider)
    } catch (err) {
      const { code, message, email } = err
      // const credential = GoogleAuthProvider.credentialFromError(err)
      console.error(code, message, email)
    }
  }

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

  const inputs = [
    {Icon: EnvelopeIcon, type: 'email', label: 'Email', value: email, setState: setEmail, autoComplete: 'email'},
    {Icon: LockIcon, alt: 'Lock Icon', type: 'password', label: 'Password', value: password, setState: setPassword, autoComplete: isUserLoggingIn ? 'current-password' : 'new-password'}
  ]

  const inputsMapped = inputs.map(({Icon, type, label, value, setState, autoComplete}) => {
    const onChangeHandler = e => setState(e.target.value)

    const specialType = type === 'password' 
      ? isPasswordVisible 
        ? 'text' 
        : 'password' 
      : 'email'
    
    return (
      <div key={type} className="px-4 py-2 bg-white text-gray-500 w-64 sm:w-80 flex flex-row items-center rounded-md mt-4 focus-within:text-gray-900 dark:bg-black dark:text-gray-300 dark:focus-within:text-gray-50">
        <Icon />
        <input
          className="placeholder-current bg-transparent ml-2 w-full focus:outline-none dark:placeholder-current"
          type={specialType}
          placeholder={label}
          aria-label={label}
          name={type}
          value={value} 
          onChange={onChangeHandler}
          autoComplete={autoComplete}
          aria-required
          required
          //aria-invalid={checkEmailAndPassword}
        />
        {type === 'password' && (
          <button type="button" title={isPasswordVisible ? 'Hide Password' : 'Show Password'} onClick={toggleIsPasswordVisible}>
            <EyeIcon isEyeClosed={isPasswordVisible} />
          </button>
        )}
      </div>
    )
  })

  return (
    <>
      <Head>
        <title>{loginOrSignupText}</title>
        <meta name="description" content="Login or Signup to Budgewit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center bg-white dark:bg-black">
        <section className="flex flex-col items-center">
          <div className="bg-gray-200 py-8 px-12 sm:p-12 rounded-xl dark:bg-gray-800">
            <fieldset>
              <legend className="mb-1 sm:mb-2 text-2xl font-medium text-gray-800 dark:text-gray-100">
                {isUserLoggingIn ? 'Login to Budgewit' : 'Welcome to Budgewit!'}
              </legend>
              <form onSubmit={onSubmitHandler}>
                <div className="flex flex-col">
                  {inputsMapped}
                </div>
                <div className="flex flex-col-reverse items-center sm:flex-row sm:items-end sm:justify-between mt-6 sm:mt-8">
                  {isUserLoggingIn && (
                    <Link href="/auth/forgot-password">
                      <a className="bg-transparent text-sm text-gray-700 dark:text-gray-400 hover:underline cursor-pointer">Forgot your password?</a>
                    </Link>
                  )}
                  <button 
                    type="submit"
                    className={`bg-green-500 transition-width w-full ${isUserLoggingIn && 'sm:w-4/12'} mb-2 sm:mb-0 px-8 py-2 rounded-md text-white text-md font-medium dark:bg-green-600 focus:outline-none focus:bg-green-800 active:bg-green-800 hover:bg-green-800`}
                  >
                    {loginOrSignupText}
                  </button>
                </div>
              </form>
            </fieldset>
          </div>
          <div className="flex flex-row mt-4">
            <p className="text-sm text-gray-900 dark:text-gray-200 mr-2">
              {isUserLoggingIn ? 'Need an account?' : 'Already have an account?'}
            </p>
            <input 
              type="button" 
              className="bg-transparent text-sm cursor-pointer text-green-500 dark:text-green-400 font-semibold hover:underline active:underline active:outline-none focus:outline-none active:text-gray-200"
              value={isUserLoggingIn ? 'Sign up' : 'Login'} 
              onClick={toggleIsUserLoggingIn}
            />
          </div>
          <div className="flex flex-col justify-center items-center mt-4">
            <h2 className="dark:text-white font-semibold text-sm mb-2">Or</h2>
            <button type="button" onClick={googleSignInTest} className="bg-gray-200 dark:bg-gray-800 flex flex-row items-center p-2 rounded-md">
              <GoogleLogoIcon />
              <span className="pl-2 text-gray-800 dark:text-gray-100 text-sm">Continue with Google</span>
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default Auth
