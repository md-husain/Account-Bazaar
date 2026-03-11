import {configureStore} from '@reduxjs/toolkit'
import listiingReducer from './features/listingSlice'
import chatReducer from './features/chatSlice'

export const store = configureStore({
    reducer:{
        listing:listiingReducer,
        chat: chatReducer
    }
})
