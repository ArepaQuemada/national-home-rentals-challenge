import { useCallback, useEffect, useState } from "react"

export const useAsync = ({ service,  callOnLoad }) => {
    const [ asyncState, setAsyncState ] = useState({
        data: null,
        isLoading: false,
    })

    const setLoading = (isLoading) => {
        setAsyncState(prev => ({...prev, isLoading: isLoading}))
    }

    const setDataRes = (data) => {
        setAsyncState(prev => ({...prev, data: data }))
    }

    const doCallService = useCallback(async(newService) => {
        let serviceToCall = newService ?? service
        
        try {
            setLoading(true)
            const data = await serviceToCall?.()
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
    

    return { asyncState, doCallService } 
}