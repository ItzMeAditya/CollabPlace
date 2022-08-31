import React, {useState, useContext} from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, hasError, sendRequest, clearError} = useHttpClient();

  const [formState,inputHandler, setFormData] = useForm({
    email : {
        value : "",
        isValid : false
    },
    password : {
        value : "",
        isValid : false
    }
  },false);


  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image : undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image : {
            value : null,
            isValid : false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };


  const authSubmitHandler = async event => {
    event.preventDefault();
    if(isLoginMode){   
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          JSON.stringify({
            email : formState.inputs.email.value,
            password : formState.inputs.password.value
          }),
          {
            'Content-Type' : 'application/json'
          }
        );
        
        auth.login(responseData.userId, responseData.token);
      } catch (err) {

      }
    } else {
      try {
        const formData = new FormData();
        formData.append('name',formState.inputs.name.value);
        formData.append('email',formState.inputs.email.value);
        formData.append('password',formState.inputs.password.value);
        formData.append('image',formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +'/users/signup',
          "POST",
          formData
          );
        
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={hasError} onClear={clearError}/>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay/>}
        {isLoginMode ? <h2>Login</h2> : <h2>Sign Up</h2> }
        <hr />
        <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
              />
            )}
            {!isLoginMode && 
              <ImageUpload 
                center id='image' 
                onInput={inputHandler} 
                errorText = "Please provide an image." 
              />
            }
            <Input 
                id="email"
                element = "input"
                type = "email"
                label = "E-Mail"
                validators = {[VALIDATOR_EMAIL()]}
                errorText = "Please enter a valid email address!"
                onInput = {inputHandler}
            />
            <Input 
                id="password"
                element = "input"
                type = "password"
                label = "Password"
                validators = {[VALIDATOR_MINLENGTH(6)]}
                errorText = "Please enter a valid password (atleast 6 characters long)."
                onInput = {inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'Login' : 'Sign Up'}</Button>
        </form>
        <button className="switch-btn" onClick={switchModeHandler}>{isLoginMode ? 'Sign Up' : 'Login'}</button>
      </Card>
    </React.Fragment>
  )
}

export default Auth;