import { getSearchChat } from "api"
import { useQuery } from "react-query"

export const useSearchChat = (name: string) => {
  return useQuery(['SEARCHED-CHAT', name], () => getSearchChat(name), {
    enabled: name.length > 2,
    refetchInterval: 4000,
  })
}