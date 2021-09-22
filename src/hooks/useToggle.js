import { useState, useCallback } from 'react'

const useToggle = initialState => {
  const [isToggledOn, setToggle] = useState(initialState);

  const toggle = useCallback(() => setToggle(state => !state), []);

  return [isToggledOn, toggle];
}

export default useToggle