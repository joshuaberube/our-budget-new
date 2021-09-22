import { signOut } from '@firebase/auth'
import Link from 'next/link'
import useFirebase from '../hooks/useFirebase'
import useUser from '../hooks/useUser'

const Header = () => {
  const { user, isUserLoading } = useUser()
  const { auth } = useFirebase()

  const buttonClicked = () => {
    if (!user || isUserLoading) {
      //fire GTM
    } else {
      //fire GTM
      signOut(auth)
    }
  }

  const linkText = !user || isUserLoading ? 'Login / Signup' : 'Logout'

  return (
    <header>
      <div>Our Budget</div>
      <Link href="/auth">
        <a onClick={buttonClicked}>{linkText}</a>
      </Link>
    </header>
  )
}

export default Header
