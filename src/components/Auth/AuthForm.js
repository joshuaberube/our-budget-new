import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

import useFirebase from '../../hooks/useFirebase'
import AuthInput from './AuthInput'
import EnvelopeIcon from '../../assets/icons/EnvelopeIcon'
import LockIcon from '../../assets/icons/LockIcon'

const AuthForm = ({isNewUser}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { auth, analytics } = useFirebase()
  const router = useRouter()

  // for the default email and password fields
  const onSubmitHandler = async e => {
    e.preventDefault()

    try {
      if (isNewUser) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(user)
        //redirect to emailVerification page
      }

      const eventName = isNewUser ? 'login' : 'sign_up'
      logEvent(analytics, eventName, { method: 'emailAndPassword' })

      router.push('/dashboard')
    } catch (err) {
      console.log(err)
      switch(err.code) {
        case 'auth/email-already-in-use':
          setError('A user with that email already exists')
        case 'auth/user-not-found' | 'auth/wrong-password':
          setError('Invalid email or password')
      }
    }
  }


  // this is the way I go about making inputs generally- it allows me to easily add more if ever needed, and I can change the code in one place
  const inputs = [
    {Icon: EnvelopeIcon, type: 'email', label: 'Email', value: email, setState: setEmail, autoComplete: 'email'},
    {Icon: LockIcon, alt: 'Lock Icon', type: 'password', label: 'Password', value: password, setState: setPassword, autoComplete: isNewUser ? 'current-password' : 'new-password'}
  ]

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex flex-col">
        {inputs.map(input => <AuthInput key={input.label} input={input} />)}
      </div>
      <div className="flex flex-col-reverse items-center mt-6 sm:flex-row sm:items-end sm:justify-between sm:mt-8">
        {isNewUser && (
          <Link href="/auth/forgot-password">
            <a className="text-sm text-gray-700 bg-transparent cursor-pointer dark:text-gray-400 hover:underline">
              Forgot your password?
            </a>
          </Link>
        )}
        <button 
          type="submit"
          className={`bg-green-500 transition-width w-full ${isNewUser ? 'sm:w-4/12' : ''} mb-2 sm:mb-0 px-8 py-2 rounded-md text-white text-md font-medium dark:bg-green-600 focus:outline-none focus:bg-green-800 active:bg-green-800 hover:bg-green-800`}
        >
          {isNewUser ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </form>
  )
}

export default AuthForm