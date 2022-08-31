import React, {useEffect, useState, useContext} from "react";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import SingleUser from "../components/SingleUser";

const User = () => {
    const auth = useContext(AuthContext);
    const [singleUser, setSingleUser] = useState();
    const {isLoading, sendRequest } = useHttpClient();
    
    const uId = auth.userId;

    useEffect(()=>{
        const fetchUsers = async () => {

            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+`/users/user/${uId}`);

                setSingleUser(responseData.user);
            } catch (err) {}
        };

        fetchUsers();
    },[sendRequest, uId]);

    return (
        <React.Fragment>
            {isLoading && 
                <div className="center">
                    <LoadingSpinner asOverlay/>
                </div>
            }
            {!isLoading && singleUser && <SingleUser data={singleUser} /> }
        </React.Fragment>
    );
}

export default User;