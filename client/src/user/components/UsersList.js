import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import './UsersList.css';

const UsersList = props => {
    if (props.data.length === 0)
    {
        return (
            <div className="no-users center">
                <Card>
                    <h2>No Users Found!</h2>
                </Card>
            </div>
        );
    }

    return (
        <ul className="users-list">
            {props.data.map(user => (
                <UserItem 
                    key = {user.id}
                    id = {user.id}
                    name = {user.name}
                    image = {user.image}
                    placeCount = {user.places.length}
                />
            ))}
        </ul>
    );
};

export default UsersList;