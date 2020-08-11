import React ,{useState,useEffect}from 'react'
import UserList from '../components/userList'
import ErrorModal from '../../Shared/UIelements/ErrorModal'
import LoadingSpinner from '../../Shared/UIelements/LoadingSpinner'
import {useHttpClient} from '../../Shared/Hooks/http-hook'


const User =(props)=>{
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
   const [Users ,setUsers]=useState([])

useEffect(()=>{
    const requestusers=async ()=>{
        
        try {
        const response =await sendRequest("http://localhost:5000/api/users/")
        setUsers(response.users)
            
        } catch (error) {
           console.log(error)
        }
        }
    requestusers()
},[sendRequest])


  
    return (<React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
       <div className="center">
      {isLoading && <LoadingSpinner />}
      </div>
   {!isLoading && !error && <UserList userList={Users} />}
    </React.Fragment>)
    
    
}

export default User