import { login, logout } from "../../store/auth"




export const Logout = () => {
  const dispatch = useDispatch();
  
  return (
        dispatch(login())
  )
}
