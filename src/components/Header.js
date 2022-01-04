import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import useFirebase from '../hooks/useFirebase'
import useUser from '../hooks/useUser'

const Header = () => {
  const { user, isUserLoading } = useUser()
  const { auth } = useFirebase()
  const router = useRouter()

  const buttonClicked = () => {
    console.log(!user || isUserLoading)
    if (!user || isUserLoading) {
      //fire GTM
      router.push('/auth')
    } else {
      //fire GTM
      signOut(auth)
      .then(() => {
        router.push('/auth')
      })
      .catch(err => console.error('kewl', err))
    }
  }

  const linkText = !user || isUserLoading ? 'Login / Signup' : 'Logout'

  return (
    <header className="dark:text-white">
      <div>Our Budget</div>
      <input type="button" value={linkText} onClick={buttonClicked} />
    </header>
  )
}

export default Header
