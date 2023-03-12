import { usernameShorter } from "utils/str";

export const Avatar = ({avatar, username}: {avatar?: string, username?: string}) => {
  const uname = usernameShorter(username ?? '');
  
  return (
		<span className="w-12 hidden md:grid overflow-hidden aspect-square  place-items-center rounded-full bg-slate-100 ">
			{avatar ? <img src={avatar} alt=":profile" /> : uname}
		</span>
	);
}
export const ListAvatar = ({
	avatar,
	username,
	size='w-12',
}: {
	avatar?: string;
		username?: string;
	size?: 'w-10' |'w-12' | 'w-14' | 'w-16' | 'w-20';
}) => {
	const uname = usernameShorter(username ?? '');
	return (
		<span className={"grid overflow-hidden aspect-square  place-items-center rounded-full bg-slate-100 " + size}>
			{avatar ? <img src={avatar} alt=":profile" /> : uname}
		</span>
	);
};