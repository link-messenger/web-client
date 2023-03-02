import { pb } from 'api';
import { CREATE_ROOM_INITIALS } from 'constants';
import { useMutation,  useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

type roomData = typeof CREATE_ROOM_INITIALS & {
  users: string[]
}

export const useCreateRoom = () => {
  const navigate = useNavigate();
  return useMutation(
    ['CREATE-ROOM'],
    (data: roomData) => {
      return pb.collection('rooms').create(data);
    },
    {
      onSuccess: (data) => {
        navigate(`/room/${data.id}`);
      },
    },
  );
};


export const useGetRoom = (id:string) => {
  return useQuery(['ROOM', id], () => {
    return pb.collection('rooms').getOne(id);
  });
}