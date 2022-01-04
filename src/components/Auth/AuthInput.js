import EyeIcon from "../../assets/icons/EyeClosedIcon"
import useToggle from '../../hooks/useToggle';


const AuthInput = ({input: {Icon, type, label, value, setState, autoComplete}}) => {
  const [isPasswordVisible, toggleIsPasswordVisible] = useToggle(false)

  const onChangeHandler = e => setState(e.target.value)

  const specialType = type === 'password' 
    ? isPasswordVisible 
      ? 'text' 
      : 'password'
    : 'email'
  
  return (
    <div key={type} className="flex flex-row items-center w-64 px-4 py-2 mt-4 text-gray-500 bg-white rounded-md sm:w-80 focus-within:text-gray-900 dark:bg-black dark:text-gray-300 dark:focus-within:text-gray-50">
      <Icon />
      <input
        className="w-full ml-2 placeholder-current bg-transparent focus:outline-none dark:placeholder-current"
        type={specialType}
        placeholder={label}
        aria-label={label}
        title={label}
        name={type}
        value={value} 
        onChange={onChangeHandler}
        autoComplete={autoComplete}
        aria-required
        required
        //aria-invalid={checkEmailAndPassword}
      />
      {type === 'password' && (
        <button type="button" title={isPasswordVisible ? 'Hide Password' : 'Show Password'} onClick={toggleIsPasswordVisible}>
          <EyeIcon isEyeClosed={isPasswordVisible} />
        </button>
      )}
    </div>
  )
}

export default AuthInput