import * as React from 'react'

const SearchBoxContext = React.createContext()

function searchBoxReducer(state, action) {
    switch (action.type) {
        case 'SET_SEARCH_BOX': {
            // return { count: state.count + 1 }
            return { ...state, ...action.payload };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

export const SearchBoxProvider = ({ children }) => {
    const [state, dispatchState] = React.useReducer(searchBoxReducer, { text: "" });
    // NOTE: you *might* need to memoize this value
    // Learn more in http://kcd.im/optimize-context
    const value = { state, dispatchState }
    return <SearchBoxContext.Provider value={value}>{children}</SearchBoxContext.Provider>
}

export const useSearchBox = () => {
    const context = React.useContext(SearchBoxContext)
    if (context === undefined) {
        throw new Error('useCount must be used within a CountProvider')
    }
    return context
}

// export default { CountProvider }