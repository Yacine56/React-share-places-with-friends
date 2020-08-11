import React, { useContext }  /* { useCallback,useReducer}*/ from 'react'
import Input from '../../Shared/UIelements/Input'
import './NewPlace.css'
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../Shared/validators'
import Button from '../../Shared/UIelements/Button'
import {useForm} from '../../Shared/Hooks/form-hook'
import {useHttpClient} from '../../Shared/Hooks/http-hook'
import ErrorModal from '../../Shared/UIelements/ErrorModal'
import LoadingSpinner from '../../Shared/UIelements/LoadingSpinner'
import {AuthContext} from '../../Shared/context/auth-context'
import ImageUpload from '../../Shared/UIelements/ImageUpload'



const NewPlace =(props)=>{
  const auth =useContext(AuthContext)
  const { isLoading,error,sendRequest,clearError}=useHttpClient()
  const [formState, inputHandler] =useForm(   {
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    }
  },
  false)


  const placeSubmitHandler = async (event) => {
    event.preventDefault();
   try {
     const formdata=new FormData()
     formdata.append("title",formState.inputs.title.value)
      formdata.append("description",formState.inputs.description.value)
      formdata.append("address",formState.inputs.address.value)
      formdata.append("creator",auth.userId)
      formdata.append("image",formState.inputs.image.value)
    const response = await sendRequest("http://localhost:5000/api/places",
    "POST",
    formdata,
    {Authorization:"Bearer "+auth.token}
    )
    console.log(response)
   } catch (error) {
     console.log(error)
   }
  
  };

    return(
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        <div className='place-form'>
       {isLoading ? <LoadingSpinner /> : <form onSubmit={placeSubmitHandler }>
        <Input
        id='title'
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
       <Input
        id='address'
        element="input"
        type="text"
        label="address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid adress"
        onInput={inputHandler}
      />
       <Input
       id='description'
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a minimum of 5 caracteres."
        onInput={inputHandler}
      />
      <ImageUpload id="image" onInput={inputHandler} errorText="please add  an image" />
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
        </form>}
        </div>
        </React.Fragment>
    )
}

export default NewPlace