import { useCallback, useEffect, useState } from "react"

export const useAsync = ({ service,  callOnLoad }) => {
    const [ asyncState, setAsyncState ] = useState({
        data: [],
        isLoading: false,
    })

    const setLoading = (isLoading) => {
        setAsyncState(prev => ({...prev, isLoading: isLoading}))
    }

    const setDataRes = (data) => {
        setAsyncState(prev => ({...prev, data: data }))
    }

    const doCallService = useCallback(async() => {
        try {
            setLoading(true)
            const data = await service?.()
            setDataRes(data)
        } catch(err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }, [ service ])

    useEffect(() => {
        if (callOnLoad) {
            doCallService()
        }
    }, [doCallService, callOnLoad])
    
    const doCallAdd = useCallback(async(service, params) => {
        try {
            setLoading(true)
            const response = await service?.(params)
            setDataRes([...asyncState.data, response])
        } catch(err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }, [asyncState.data])

    return { asyncState, doCallService, doCallAdd } 
}