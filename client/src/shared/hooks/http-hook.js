import { useState,useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET',body = null, headers = {}) => {

        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const response = await fetch (url,{
                method,
                body,
                headers,
                signal : httpAbortCtrl.signal
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if (!response.ok){
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setHasError(err.message);
            setIsLoading(false);
            throw err;
        };
    },[]);

    useEffect( () => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        }
    },[])

    const clearError = () => {
        setHasError(null);
    };

    return {isLoading, hasError, sendRequest, clearError};
}