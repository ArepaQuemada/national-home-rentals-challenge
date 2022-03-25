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

    const callService = useCallback(async (service, params) => {
        try {
            setLoading(true)
            const data = await service?.(params)
            return data
        } catch(err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const doCallService = useCallback(async() => {
        const data = await callService(service)
        setDataRes(data)

    }, [callService, service])

    const doCallAdd = useCallback(async(service, params) => {
        const response = await callService?.(service, params)
        if (response) {
            setDataRes([...asyncState.data, response])
        }
    }, [asyncState.data, callService])

    const doCallDelete = useCallback(async (service, params) => {
        const response = await callService?.(service, params)
        if (response) {
            setDataRes(asyncState.data.filter(item => item.id !== params))
        }
    }, [asyncState.data, callService])

    useEffect(() => {
        if (callOnLoad) {
            doCallService()
        }
    }, [doCallService, callOnLoad])
    
    return { asyncState, doCallService, doCallAdd, doCallDelete } 
}