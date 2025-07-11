import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";




export const userApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) =>({

        login:builder.mutation({
            query:(data) =>({
                url:`${USERS_URL}/auth`,
                method:'POST',
                body:data,
            }),
        }),

        register:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}`,
                method:"POST",
                body:data,
            })
        }),

        logout:builder.mutation({
            query:()=>({
                url:`${USERS_URL}/logout`,
                method:'POST',

            }),
        }),

        profile:builder.query({
            query:()=>({
                url:`${USERS_URL}/profile`,
            })
        }),

        updateUser:builder.mutation({
            query:(data)=>({
                url:`${USERS_URL}/profile`,
                method:"PUT",
                body:data,
            })
        }),

        deleteCurrentUser:builder.mutation({
            query:()=>({
                url:`${USERS_URL}/delete`,
                method:'DELETE'
            })
        }),

        getUsersCount:builder.query({
            query:()=>`${USERS_URL}/count`
        }),

        getAllUsers:builder.query({
            query:()=>`${USERS_URL}`
        }),

        deleteUser:builder.mutation({
            query:(id)=>({
                url:`${USERS_URL}/delete/${id}`,
                method:'DELETE',

            }),
        })


    }),
});


export const {useLoginMutation ,
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useRegisterMutation ,
    useLogoutMutation ,
    useProfileQuery ,
    useUpdateUserMutation,
useDeleteCurrentUserMutation,
useGetUsersCountQuery
} = userApiSlice;