import React, {useEffect, useState} from "react";

import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const {isLoading, hasError, sendRequest, clearError } = useHttpClient();

    useEffect(()=>{
        const fetchUsers = async () => {

            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL +'/users/all');

                setLoadedUsers(responseData.users);
            } catch (err) {}
        };
        fetchUsers();
    },[sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={hasError} onClear={clearError} />
            {isLoading && 
                <div className="center">
                    <LoadingSpinner asOverlay/>
                </div>
            }
            {!isLoading && loadedUsers && <UsersList data={loadedUsers} /> }
        </React.Fragment>
    );
};

export default Users;