import { apiSlice } from "./apiSlice";
import { ROOM_URL } from "../constants";

export const roomApiSlice = apiSlice.injectEndpoints({

    endpoints:(builder)=>({
        getRooms:builder.query({
            query:()=>({
                url:`${ROOM_URL}`,
            }),

            providesTags:['Room']
        }),

        createRoom:builder.mutation({
            query:(data)=>({
                url:`${ROOM_URL}`,
                method:'POST',
                body:data,
            }),

            invalidatesTags:['Room']
        }),

        updateRoom:builder.mutation({
            query:({id,data})=>({
                url:`${ROOM_URL}/${id}`,
                method:'PUT',
                body:data,
            }),
            invalidatesTags:['Room']
        }),

        deleteRoom:builder.mutation({
            query:(id)=>({
                url:`${ROOM_URL}/${id}`,
                method:'DELETE',
            }),
            invalidatesTags:['Room']
        }),

        getRoomById:builder.query({
            query:(id)=>({
                url:`${ROOM_URL}/${id}`
            })
        }),

        getSearchRoom:builder.query({
            query:(searchparams) => `${ROOM_URL}/search?q=${searchparams}`,
            providesTags:['Room']
        }),

        getJoinedRooms:builder.query({
            query:()=>`${ROOM_URL}/joinedrooms`,
            providesTags:['Room']
        }),

        removeParticipant:builder.mutation({
            query:({name,data})=>({
                url:`${ROOM_URL}/updateparticipant/${name}`,
                body:data,
                method:"PUT"
            }),
            invalidatesTags:['Room']
        })
    })
})


export const {useGetRoomsQuery,useRemoveParticipantMutation ,useCreateRoomMutation ,useDeleteRoomMutation,useGetJoinedRoomsQuery ,useUpdateRoomMutation ,useGetRoomByIdQuery ,useGetSearchRoomQuery} = roomApiSlice;

