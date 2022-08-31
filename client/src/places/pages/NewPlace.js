import React, {useContext} from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading, hasError, sendRequest, clearError} = useHttpClient();

  const[formState,inputHandler] = useForm ({
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
    },
    image : {
      value : null,
      isValid : false
    }
  },false);

  const History = useHistory();   // useHistory hook helps us to go to new page by adding it on the stack or replacing the current page.

  const submitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title',formState.inputs.title.value);
      formData.append('description',formState.inputs.description.value);
      formData.append('address',formState.inputs.address.value);
      formData.append('creator',auth.userId);
      formData.append('image',formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/places/',
        'POST',
        formData,
        {
          Authorization : 'Bearer ' + auth.token
        }
      );

      History.push('/');
    } catch (err) {}
  }


  return (
    <React.Fragment>
    <ErrorModal error={hasError} onClear={clearError} />
    <form className="place-form" onSubmit={submitHandler}>
      {isLoading && <LoadingSpinner asOverlay/> }
      <Input 
        id = "title"
        element="input" 
        type="text" 
        label="Title" 
        placeholder="Enter Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <ImageUpload 
        center id='image' 
        onInput={inputHandler} 
        errorText = "Please provide an image." 
      />
      <Input 
        id = "description"
        element="textarea" 
        label="Description" 
        placeholder="Enter some description about place."
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input 
        id = "address"
        element="input" 
        label="Address" 
        placeholder="Enter address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlace;