import { useRouter } from 'next/router'
import Header from './header'

const Layout = ({ children }) => {
  const router = useRouter()
  const authPages = router.pathname.includes('/auth')

  return (
    <>
      {!authPages && <Header />}
      {children}
    </>
  )
}

export default Layout
