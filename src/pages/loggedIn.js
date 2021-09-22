import useUser from '../hooks/useUser'

const LoggedIn = () => {
  const { user, isUserLoading } = useUser()
  if (isUserLoading) return <div>loading...</div>
  if (!user) return <div>login...</div>
  
  return <div>{user.email}</div>
}

export default LoggedIn
