import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getRedirectResult } from 'firebase/auth'
import { logEvent } from 'firebase/analytics'
import useFirebase from '../../hooks/useFirebase'

// wip
const LoadingPage = () => {
  const { auth, analytics } = useFirebase()
  const router = useRouter()

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

  return (
    <div>loading...</div>
  )
}

export default LoadingPage