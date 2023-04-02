import axios from "axios";
import { useEffect, useState } from "react";

export default function useAxios() {

    const [options, setOptions] = useState();
    const [response, setResponse] = useState([]);
    const [errors, setErrors] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (options) {
            if (loading) return;

            setLoading(true);
            setErrors();

            axios(options)
                .then(r => {
                    setResponse(r.data ? r.data : []);
                })
                .catch(r => {
                    if (r?.response?.status === 422) setErrors(r.response.data.errors);
                    else alert('Something went wrong please try again');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [options]);

    return [setOptions, loading, response, errors, setResponse];
}

