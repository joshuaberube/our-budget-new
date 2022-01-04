import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { getAnalytics } from 'firebase/analytics'

const useFirebase = () => {
  const [state, setState] = useState({})

  useEffect(() => {
    const analytics = getAnalytics()
    const auth = getAuth()
    auth.useDeviceLanguage()

    setState({ analytics, auth })
  }, [])

  return state
}

export default useFirebase
