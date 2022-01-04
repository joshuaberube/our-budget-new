const ContinueWithAuthButton = ({buttonData: { onClickHandler, Icon, company }}) => {
  return (
    <li>
      <button type="button" onClick={onClickHandler} className="flex flex-row items-center p-2 bg-gray-200 rounded-md dark:bg-gray-800">
        <Icon />
        <p className="pl-2 text-sm text-gray-800 dark:text-gray-100">Continue with {company}</p>
      </button>
    </li>
  )
}

export default ContinueWithAuthButton