import { pb } from "api"
import { MESSAGE_INITIALS } from "constants"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { useGetUserProfile } from "./useUser"

export const useSendChat = () => {
  const navigate = useNavigate();
  const { data: userData } = useGetUserProfile({
    onError: () => {
      navigate('/login')
    }
  });
  return useMutation(['SEND-CHAT'], (data: typeof MESSAGE_INITIALS) => {
    if (!userData?.id) throw new Error('User Cannot be loaded!');
    return pb.collection('messages').create({
      ...data,
      user: userData.id
    });
  })
}