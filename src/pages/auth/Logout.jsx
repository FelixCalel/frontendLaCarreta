import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; 
import { logout } from "../../store/auth"; 

export const Logout = () => {
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return null; 
};
