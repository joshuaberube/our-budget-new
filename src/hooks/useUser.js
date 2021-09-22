import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import useFirebase from './useFirebase'

const useUser = () => {
  const { auth } = useFirebase()
  const [user, setUser] = useState((auth && auth.currentUser) || 'loading')

  useEffect(() => {
    if (auth) {
      onAuthStateChanged(auth, authenticatedUser => {
        if (authenticatedUser && user !== 'loading') {
          return setUser(authenticatedUser)
        }
  
        return setUser(null)
      })
    }
  }, [auth, user])

  return { user, isUserLoading: user === 'loading' }
}

export default useUser
