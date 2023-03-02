import { pb } from 'api';
import { LOGIN_INITIALS } from 'constants';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation(
    ['LOGIN'],
    (data: typeof LOGIN_INITIALS) =>
      pb
        .collection('users')
        .authWithPassword(
          data.email,
          data.password,
        ),
    {
      onSuccess: () => {
        if (navigate.length !== 0) {
          navigate(-1);
        } else {
          navigate('/waiting');
        }
      },
    },
  );
};
