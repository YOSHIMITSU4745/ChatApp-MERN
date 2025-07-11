
import { MESSAGE_URL} from "../constants";
import { apiSlice } from "./apiSlice";




const messageApiSlice = apiSlice.injectEndpoints({

    endpoints:(builder)=>({
        createMessage:builder.mutation({
            query:(data)=>({
                url:`${MESSAGE_URL}`,
                method:"POST",
                body:data,
            }),
            invalidatesTags:['Messages']
        }),

        getMessages:builder.query({
            query:(roomid)=>({
                url:`${MESSAGE_URL}/${roomid}`,
            })
        }),

        deleteMessage:builder.mutation({
            query:(id)=>({
                url:`${MESSAGE_URL}/${id}`,
                method:'DELETE'
            })
        }),

        updateMessage:builder.mutation({
            query:({id,content})=>({
            
                url:`${MESSAGE_URL}/${id}`,
                method:'PUT',
                body:{content}
            })
        }),

        getMessagesByUserId:builder.query({
            query:(id)=>`${MESSAGE_URL}/user/${id}`,
            providesTags:['Messages']
        }),

        getMessagesCount:builder.query({
            query:()=>`${MESSAGE_URL}/count`
        })

    })
})

export const {useCreateMessageMutation 
    ,useGetMessagesQuery
     ,useDeleteMessageMutation 
     ,useUpdateMessageMutation 
     ,useGetMessagesByUserIdQuery
      ,useGetMessagesCountQuery  
    }  = messageApiSlice;