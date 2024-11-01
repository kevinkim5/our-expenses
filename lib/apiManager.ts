import axios, { AxiosError } from 'axios'

const baseAPI = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

type SaveObj = {
  [key: string]: string | number | bigint | boolean | undefined
}

export const deleteAPICall = async (url: string) => {
  try {
    const res = await baseAPI.delete(url)
    return res.data
  } catch (err: unknown) {
    console.error('deleteAPICall: ', err)
    if (err instanceof AxiosError && err?.response?.status === 403)
      return { isLoggedIn: false }
    throw new Error()
  }
}

export const getAPICall = async (url: string) => {
  try {
    const res = await baseAPI.get(url)
    return res.data
  } catch (err: unknown) {
    console.log(err)
    if (err instanceof AxiosError && err?.response?.status === 403)
      return { isLoggedIn: false }
    return { error: err }
  }
}

export const postAPICall = async (url: string, dataObj: SaveObj) => {
  try {
    const formData = new FormData()
    Object.keys(dataObj).forEach((key) => {
      const value = dataObj[key]
      formData.append(key, value as string)
    })
    const res = await baseAPI.post(url, formData)
    return res.data
  } catch (err: unknown) {
    console.log(err)
    if (err instanceof AxiosError && err?.response?.status === 403)
      return { isLoggedIn: false }
    return { error: err }
  }
}
