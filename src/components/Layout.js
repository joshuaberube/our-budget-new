import { useRouter } from 'next/router'
import Header from './header'

const Layout = ({ children }) => {
  const router = useRouter()

  return (
    <>
      {router.pathname !== '/auth' && <Header />}
      {children}
    </>
  )
}

export default Layout
