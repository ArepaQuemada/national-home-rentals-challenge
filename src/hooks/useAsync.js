import { useCallback, useEffect, useState } from "react"

export const useAsync = (service) => {
    const [ asyncState, setAsyncState ] = useState({
        data: null,
        isLoading: false
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
        doCallService()
    }, [doCallService])
    

    return asyncState
}