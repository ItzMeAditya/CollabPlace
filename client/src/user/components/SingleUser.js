import React from "react";
import { Link } from 'react-router-dom';

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import './UserItem.css';
import './UsersList.css';

const SingleUser = props => {

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
            <li className="user-item">
                <Card className="user-item__content">
                    <Link to={`/${props.data.id}/places`}>
                        <div  className="user-item__image">
                            <Avatar image={props.data.image} alt={props.data.name} />
                        </div>
                        <div className="user-item__info">
                            <h2>{props.data.name}</h2>
                            <h3>{props.data.places.length} {props.data.places.length === 1 ? 'Place' : 'Places'}</h3>
                        </div>
                    </Link>
                </Card>
            </li>
        </ul>
    );
};

export default SingleUser;