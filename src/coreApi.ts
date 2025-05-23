import { useState } from "react";

export const useMutate = () => {
  
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchQuery = async (url, { token, method = 'GET', bodyData, ...customOptions }) => {
        try {
            setLoading(true);

            const headers = {
                'Accept': 'application/json',
                'Authorization': token ? `Bearer ${token}` : undefined
            };

            let requestBody;

            if (bodyData instanceof FormData) {
                // If bodyData is FormData, set Content-Type header to undefined
                // to let the browser handle it automatically
                delete headers['Content-Type'];
                requestBody = bodyData;
            } else {
                // If bodyData is not FormData, stringify it as JSON
                headers['Content-Type'] = 'application/json';
                requestBody = JSON.stringify(bodyData);
            }

            const requestOptions = {
                method,
                headers,
                body: requestBody,
                ...customOptions,
            };

            const response = await fetch(url, requestOptions);

            const responseData = await response.json();

            if (!response.ok) {            
                throw new Error(responseData.error || 'Something went wrong!');                
            }

            setData(responseData);
            setError(null);
        } catch (error) {
            setError(error.message || 'Something went wrong!');
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchQuery };
};


