import { getUserConversation, getUserGroup } from "api"
import { IConversation, IGroup } from "interfaces"
import { useMutation, useQuery } from "react-query"


export const useGetUserConversation = () => {
  return useQuery<IConversation[]>(['USER-CONVERSATION'], getUserConversation)
}
