import { CLOUDINARY_URL, MESSAGE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query: (data) => {
        
        return {
          url: `${MESSAGE_URL}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Messages"],
    }),

    getMessages: builder.query({
      query: (roomid) => ({
        url: `${MESSAGE_URL}/${roomid}`,
      }),
      providesTags: ["Messages"],
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `${MESSAGE_URL}/${id}`,
        method: "DELETE",
      }),
    }),

    updateMessage: builder.mutation({
      query: ({ id, content }) => ({
        url: `${MESSAGE_URL}/${id}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["Messages"],
    }),

    getMessagesByUserId: builder.query({
      query: (id) => `${MESSAGE_URL}/user/${id}`,
      providesTags: ["Messages"],
    }),

    getMessagesCount: builder.query({
      query: () => `${MESSAGE_URL}/count`,
    }),

    getSignature: builder.query({
      query: () => `${MESSAGE_URL}/get-signature`,
    }),

    sendFileToCloudinary: builder.mutation({
      query: ({ file, api_key, timestamp, signature, folder, cloudname }) => {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("api_key", api_key);
        formdata.append("timestamp", timestamp);
        formdata.append("signature", signature);
        formdata.append("folder", folder);
        formdata.append("use_filename", "true");

        

        return {
          url: `${CLOUDINARY_URL}/${cloudname}/auto/upload`,
          method: "POST",
          body: formdata,
          credentials: "omit",
        };
      },
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
  useGetMessagesByUserIdQuery,
  useGetMessagesCountQuery,
  useLazyGetSignatureQuery,
  useSendFileToCloudinaryMutation,
} = messageApiSlice;
