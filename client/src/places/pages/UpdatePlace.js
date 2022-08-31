import React, { useEffect, useState, useContext } from "react";
import {useParams, useHistory} from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validator";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceForm.css";

const UpdatePlace = props => {
    const auth = useContext(AuthContext);
    const {isLoading, hasError, sendRequest, clearError} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    const History = useHistory();

    const pId = useParams().placeId;

    const[formState, inputHandler, setFormData] = useForm({
        title : {
            value : '',
            isValid : false
        },
        description : {
            value : '',
            isValid : false
        }
    },false);
    
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`/places/${pId}`);

                setFormData(
                    {
                        title: {
                          value: responseData.place.title,
                          isValid: true
                        },
                        description: {
                          value: responseData.place.description,
                          isValid: true
                        }
                    },
                    true
                );
                setLoadedPlace(responseData.place);
            } catch (err) {}
        }
        fetchPlace();
    },[sendRequest, pId,setFormData ]);

    const updateSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL +`/places/${pId}`,
                'PATCH',
                JSON.stringify({
                    title : formState.inputs.title.value,
                    description : formState.inputs.description.value
                }),
                {
                    'Content-Type' : 'application/json',
                    Authorization : 'Bearer ' + auth.token
                }
            )

            History.push('/' + auth.userId + '/places');
        } catch (err) {}
    }

    if (isLoading) {
        return (
          <div className="center">
            <LoadingSpinner asOverlay/>
          </div>
        );
    }

    if (!loadedPlace)
    {
        return (
            <div className="no-place center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }


    return (
        <React.Fragment>
            <ErrorModal error={hasError} onClear={clearError} />
            {!isLoading && loadedPlace && <form className="place-form" onSubmit={updateSubmitHandler}>
                <Input 
                    id="title" 
                    type="text" 
                    element="input" 
                    label="Title" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText = "Please enter a valid title."
                    initialValue={loadedPlace.title} 
                    onInput = {inputHandler}
                    initialValid = {true}
                />
                <Input 
                    id="description" 
                    element="textarea"  
                    label="Description" 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText = "Please enter a valid description (at least 5 characters)."
                    initialValue={loadedPlace.description}
                    onInput = {inputHandler}
                    initialValid = {true}
                />
                <Button type="submit" disabled={!formState.isValid} >Update Place</Button>
            </form> }
        </React.Fragment>
    );
};

export default UpdatePlace;