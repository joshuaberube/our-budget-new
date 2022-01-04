import { useState } from 'react'
import { useRouter } from 'next/router'
import { sendPasswordResetEmail } from 'firebase/auth'
import useFirebase from '../../hooks/useFirebase'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const { auth } = useFirebase()

  const onChangeHandler = e => setEmail(e.target.value)
  const onSubmitHandler = e => {
    e.preventDefault()
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('email sent')
      })
      .catch(err => {
        console.log(err)
      })
  }
  const backButtonPressed = () => {
    //log event
    router.push('/auth')
  }

  return (
    <div>
      <h1>Forgot your password?</h1>
      <form onSubmit={onSubmitHandler}>
        <label>
          Enter the email address to send the password reset email to
          <input type="email" placeholder="email" value={email} onChange={onChangeHandler} />
        </label>
        <button type="submit">Send</button>
      </form>
      <input type="button" value="Back" onClick={backButtonPressed}/>
    </div>
  )
}

export default ForgotPassword