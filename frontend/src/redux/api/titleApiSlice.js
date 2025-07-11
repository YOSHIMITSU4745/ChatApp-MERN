import { TITLE_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const titleApiSlice = apiSlice.injectEndpoints({

    endpoints:(builder)=>({
        getTitle:builder.query({
            query:()=>({
                url:`${TITLE_URL}`,
            }),

            providesTags:['Title']
        }),

        createTitle:builder.mutation({
            query:(data)=>({
                url:`${TITLE_URL}`,
                method:'POST',
                body:data
            }),
            invalidatesTags:['Title']
        }),

        updateTitle:builder.mutation({
            query:({id,data})=>({
                url:`${TITLE_URL}/${id}`,
                method:'PUT',
                body:data
            }),
            invalidatesTags:['Title']
        }),



    })
});

export const {useGetTitleQuery,useCreateTitleMutation,useUpdateTitleMutation} = titleApiSlice;