import { BaseQueryArgs } from "@/types/base-api-type"
import { BaseQueryFn } from "@reduxjs/toolkit/query/react"
import axios, { AxiosResponse } from "axios"

export const baseQueryWithRath: BaseQueryFn<BaseQueryArgs> = async (args) => {
  // const token = await AsyncStorage.getItem("token");

  try {
    const result: AxiosResponse = await axios({
      baseURL: "https://amiraheshop.com/api/v1/",
      ...args,
      url: args.url,
      method: args.method,
      data: args.body,
      headers: {
        ...args.headers,
        Authorization: true ? `Bearer ` : "",
      },
    })
    if (typeof result?.data === "string") {
      // if (!result.data.endsWith('}')) {
      const withCurly = (result.data += "}")
      return { data: JSON.parse(withCurly) }
      // }
    }
    if (typeof result?.data === "object") {
      return { data: result?.data }
    }

    return { data: result?.data }
  } catch (error: any) {
    if (error.response?.data) {
      if (typeof error.response?.data === "string") {
        const withCurly = (error.response.data += "}")
        return { error: JSON.parse(withCurly) }
      } else {
        return { error: error.response?.data }
      }
    }
    return {
      error: {
        status: error.response?.status || 500,
        data: error.message || "Something went wrong",
      },
    }
  }
}
