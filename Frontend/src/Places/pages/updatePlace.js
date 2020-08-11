import React ,{useEffect,useState,useContext} from 'react'
import {useParams} from 'react-router-dom'
import Input from '../../Shared/UIelements/Input'
import Button from '../../Shared/UIelements/Button'
import {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../Shared/validators'
import {useForm} from '../../Shared/Hooks/form-hook'
import './NewPlace.css'
import {useHttpClient} from '../../Shared/Hooks/http-hook'
import ErrorModal from '../../Shared/UIelements/ErrorModal'
import LoadingSpinner from '../../Shared/UIelements/LoadingSpinner'
import {AuthContext} from '../../Shared/context/auth-context'



const UpdatePlace=props=>{
  const auth = useContext(AuthContext)
  const pId = useParams().placeId
  const {isLoading,error,sendRequest,clearError}=useHttpClient() 
  const [targetPlace,setTargetPlace]=useState()
  const [initialState,inputHandler,setFormData]=useForm({
    title:{
      value:'',
      isValid:true
    },
    address:{
      value:'',
      isValid:true
    },
    description:{
      value:'',
      isValid:true
    }
},true)
  useEffect(()=>{
    const requestPlace= async()=>{
         const response =await sendRequest(`http://localhost:5000/api/places/${pId}`)
        
         setTargetPlace(response.place)
         setFormData({ title:{
          value:response.place.title,
          isValid:true
        },
        address:{
          value:response.place.address,
          isValid:true
        },
        description:{
          value:response.place.description,
          isValid:true
        }
    },true)

        
    }
    requestPlace()
   }
 ,[pId,sendRequest,setFormData])

 



const updatePlace =async ()=>{
  try {
    const response =await sendRequest(`http://localhost:5000/api/places/${pId}`,
    "PATCH",
    JSON.stringify({
        title:initialState.inputs.title.value,
        address:initialState.inputs.address.value,
        description:initialState.inputs.description.value
    }),
    {
      "content-type": "application/json",
      Authorization:"Bearer "+auth.token
    }
    )
   console.log(response.place)
  } catch (error) {
    console.log(error)
  }
}



return(<React.Fragment>
  <ErrorModal error={error} onClear={clearError} />
{isLoading && <LoadingSpinner /> } 
{!isLoading && targetPlace &&<form className='place-form' onSubmit={updatePlace}>
          <Input
        id='title'
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        value={targetPlace.title}
        isValid={true}
      />
       <Input
        id='address'
        element="input"
        type="text"
        label="address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid adress"
        onInput={inputHandler}
        value={targetPlace.address}
        isValid={true}
      />
       <Input
       id='description'
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a minimum of 5 caracteres."
        onInput={inputHandler}
        value={targetPlace.description}
        isValid={true}
      />
        <Button type="submit" disabled={!initialState.isValid}>Update</Button>
      </form>}
      </React.Fragment>)

}

export default UpdatePlace