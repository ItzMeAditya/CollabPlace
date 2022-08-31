import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
 
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, hasError, sendRequest, clearError} = useHttpClient();

    const userId = useParams().userId;
    
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +`/places/user/${userId}`);

                setLoadedPlaces(responseData.places);
            } catch (err) {}
        };
        fetchPlaces();
    },[sendRequest, userId]);

    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(p => p.id !== deletedPlaceId))
    }

    if (!loadedPlaces){
        return (
            <div className="place-list center">
                <Card>
                    <h2>No Places Found For This User.</h2>
                </Card>
            </div>
        )
    }

    return (
        <React.Fragment>
            <ErrorModal error={hasError} onClear={clearError} />
            {isLoading && 
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>
            }
            {!isLoading && loadedPlaces && <PlaceList data={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
        </React.Fragment>
    )
};

export default UserPlaces;