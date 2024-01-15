import React, { createContext, useState } from "react"

interface LoadingContextInterface {
    loading: boolean
    setLoadingContext: (loadingParram: boolean) => void
}

export const LoadingContext = createContext<LoadingContextInterface>({ loading: false, setLoadingContext: (loadingParram: boolean) => { } })

const LoadingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false)

    const setLoadingContext = (loadingParram: boolean) => {
        setLoading(loadingParram)
    }

    return (
        <LoadingContext.Provider value={{ loading, setLoadingContext }}>
            {children}
        </LoadingContext.Provider>
    )

}

export default LoadingContextProvider