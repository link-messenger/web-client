import { useMutation } from "react-query"
import { postCreateGroup } from "api"

export const useCreateGroup = () => {
  return useMutation(['CREATE-GROUP'], postCreateGroup)
}