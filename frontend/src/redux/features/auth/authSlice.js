import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    userinfo:localStorage.getItem('userinfo')?JSON.parse(localStorage.getItem('userinfo')):null,
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{

        setCredentials:(state,action) =>{
            state.userinfo = action.payload;
            localStorage.setItem('userinfo',JSON.stringify(action.payload));
            const expirationTime = new Date().getTime() + 30*24*60*60*1000;
            localStorage.setItem('expirationTime',expirationTime);
        },

        logOut:(state)=>{
            state.userinfo=null;
            localStorage.clear();
        },
    }
});


export const {setCredentials, logOut} = authSlice.actions;
export default authSlice.reducer; 