import dayjs from 'dayjs'

export const convertDateStrToDayjs = (dateString: string, format = 'YYYY-MM-DDTHH:mm:ss.SSSZ') => {
  return dayjs(dateString, format)
}
