import GoogleLogoIcon from '../../assets/icons/GoogleLogoIcon'
import ContinueWithAuthButton from './ContinueWithAuthButton'
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import useFirebase from '../../hooks/useFirebase'

// this function allows me to add other auth inputs (such as continue with Apple Id) 
// as well as seperate the logic for a cleaner auth page
const OtherAuthMethods = () => {
  const { auth } = useFirebase()

  // this is the google sign on I was talking about, the signInWithRedirect works kinda stupidly
  // unless I'm actually the stupid one
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider()

    try {
      signInWithRedirect(auth, provider)
    } catch (err) {
      const { code, message, email } = err
      // const credential = GoogleAuthProvider.credentialFromError(err)
      console.error(code, message, email)
    }
  }

  const continueWithButtons = [
    {onClickHandler: googleSignIn, Icon: GoogleLogoIcon, company: 'Google'}
  ]

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="mb-2 text-sm font-semibold dark:text-white">Or</h2>
      <ul>
        {continueWithButtons.map(buttonData => (
          <ContinueWithAuthButton buttonData={buttonData} />
        ))}
      </ul>
    </div>
  )
}

export default OtherAuthMethods