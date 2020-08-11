
import  { useState, useCallback,useEffect } from 'react';


let logoutTimer

export const AuthHook =()=>{
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [expirationTime,setExpirationTime]=useState()
  
  
    const login = useCallback((uid ,token,expirationDate)=> {
      setToken(token);
      setUserId(uid);
      const tokenExpiration=expirationDate || new Date(new Date().getTime()+1000*60*60)
      setExpirationTime(expirationTime)
      localStorage.setItem("userData",JSON.stringify({userId,token,expiration:tokenExpiration.toISOString()}))
    }, [userId,expirationTime]);
  
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      setExpirationTime(null)
      localStorage.removeItem("userData")
    }, []);
  
    
    useEffect(()=>{
      if (token && expirationTime) {
      const remainingTime=expirationTime.getTime()-new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
    }
    ,[expirationTime,logout,token])
    
    useEffect(()=>{
      const data= JSON.parse(localStorage.getItem('userData'))
      if(data && data.token && new Date(data.expiration)> new Date()){
         login(data.userId,data.token,new Date(data.expiration))
        }
  }
  
  ,[login])

  return {login,logout,userId,token}
}