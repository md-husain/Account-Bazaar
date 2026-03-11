import {createSlice} from '@reduxjs/toolkit'
import { dummyListings } from '../../assets/assets'

const listingSlice = createSlice({
    name:"listing",
    initialState:{
        listings:dummyListings,
        userListings:dummyListings,
        balance:{
            earned:0,
            withdrawn:0,
            available:0
        }
    },
    reducers:{
       setListings: (state,action) =>{
        state.listings = action.payload
       },
       updateListing: (state, action) => {
        const { id, updates } = action.payload
        state.userListings = state.userListings.map((listing) =>
          listing.id === id ? { ...listing, ...updates } : listing
        )
        state.listings = state.listings.map((listing) =>
          listing.id === id ? { ...listing, ...updates } : listing
        )
       }
    }
})

export const {setListings, updateListing} = listingSlice.actions

export default listingSlice.reducer