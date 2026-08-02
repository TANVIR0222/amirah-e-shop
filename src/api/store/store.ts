import { configureStore } from "@reduxjs/toolkit"
import { api } from "../base-api/api"

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //  disable serializability check
    }).concat(api.middleware),
})

export default store
