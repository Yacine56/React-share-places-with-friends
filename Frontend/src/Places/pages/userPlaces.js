import React,{useState ,/*useContext,*/useEffect} from 'react';

import PlacesList from '../components/placesList';
import { useParams } from 'react-router-dom';
//import {AuthContext} from '../../Shared/context/auth-context'
import {useHttpClient} from '../../Shared/Hooks/http-hook'
import LoadingSpinner from '../../Shared/UIelements/ErrorModal'
import ErrorModal from '../../Shared/UIelements/ErrorModal' 



const UserPlaces = () => {
   const [places,setPlaces]=useState([])
   const userId= useParams().userId
   const {isLoading,error,sendRequest,clearError}=useHttpClient()
   
  useEffect(()=>{
      const requestPlaces=async ()=>{
        try {
          const response = await sendRequest("http://localhost:5000/api/places/user/"+userId)
          setPlaces(response.places)
          } catch (error) {
           console.log(error)
      }}
        requestPlaces()
    }
      
    ,[sendRequest,userId])
  
    const afterDeleteHandler=(id)=>{
        const p =places.filter(place=>place.id!==id)
        setPlaces(p)
    } 
 
     return (<React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading ? <LoadingSpinner/> : 
        <PlacesList placesList={places} ondelete={afterDeleteHandler} />
        }

     </React.Fragment>)

}

export default UserPlaces;