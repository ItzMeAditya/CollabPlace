import React from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItems from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = props => {
    if (props.data.length === 0)
    {
        return <div className="place-list center">
            <Card>
                <h2>No Places Found! May be Add Some?</h2>
                <Button to="/places/new">Share Place</Button>
            </Card>
        </div>
    }

    return (
        <ul className="place-list">
            {props.data.map(place => (
                <PlaceItems 
                    key = {place.id}
                    id = {place.id}
                    title = {place.title}
                    description = {place.description}
                    image = {place.image}
                    address = {place.address}
                    creatorId = {place.creator}
                    coordinates = {place.location}
                    onDelete = {props.onDeletePlace}
                />
            ))}
        </ul>
    )
}

export default PlaceList;