import React, { useState, useContext } from "react";
import Input from "../../Shared/UIelements/Input";
import Button from "../../Shared/UIelements/Button";
import "./auth.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/validators";
import { useForm } from "../../Shared/Hooks/form-hook";
import LoadingSpinner from "../../Shared/UIelements/LoadingSpinner";
import ErrorModal from "../../Shared/UIelements/ErrorModal";
import { useHttpClient } from "../../Shared/Hooks/http-hook";
import {AuthContext}  from '../../Shared/context/auth-context'

import ImageUpload from "../../Shared/UIelements/ImageUpload";


const Auth = (props) => {
  const auth = useContext(AuthContext)
  const [switchLogin, setSwitchLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const loginSubmitHandler = async (event) => {
    event.preventDefault();
    setFormData(
      {
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        },
        image: {
          value: null,
          isValid: false
        }
      },
      false
    );
    try {
      const response = await sendRequest(
        "http://localhost:5000/api/users/login ",
        "POST",
       JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          "content-type": "application/json",
        }
      );
      auth.login(response.userId,response.token)

    } catch (err) {
  
      console.log(err);
    }
  };

  const switchHandler = (event) => {
    if (!switchLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    event.preventDefault();
    setSwitchLogin(!switchLogin);
  };


  const signUpSubmitHandler = async (event) => {
    event.preventDefault();
    setFormData(
      {
        ...formState.inputs,
        name: undefined,
        image: undefined
      },
      formState.inputs.email.isValid && formState.inputs.password.isValid
    );
    try {
      const formdata=new FormData()
      formdata.append("name",formState.inputs.name.value)
      formdata.append("email",formState.inputs.email.value)
      formdata.append("password",formState.inputs.password.value)
      formdata.append("image",formState.inputs.image.value)

      const response = await sendRequest(" http://localhost:5000/api/users/signup ",
         "POST",
        formdata 
       
        );
     
       auth.login(response.userId,response.token)
    } catch (err) {
   
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="place-form">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form>
            {!switchLogin && (
               <React.Fragment>
              <Input
                id="name"
                type="text"
                element="input"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(2)]}
                errorText="Please enter Your Name"
                onInput={inputHandler}
              />
            <ImageUpload center id="image" onInput={inputHandler} />
            </React.Fragment>
              )
            }
            <Input
              id="email"
              type="email"
              element="input"
              label="E-Mail"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email."
              onInput={inputHandler}
            />
            <Input
              id="password"
              type="password"
              element="input"
              label="Password"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
              errorText="Please ente at least 5 caracteres password."
              onInput={inputHandler}
            />

            {switchLogin ? (
              <React.Fragment>
                <Button inverse onClick={switchHandler}>
                  <u>not a user yet ? Sign Up</u>
                </Button>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  onClick={loginSubmitHandler}
                >
                  Login
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button inverse onClick={switchHandler}>
                  <u>return to Login</u>
                </Button>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  onClick={signUpSubmitHandler}
                >
                  Sign-Up
                </Button>
              </React.Fragment>
            )}
          </form>
        )}
      </div>
    </React.Fragment>
  );
};

export default Auth;
