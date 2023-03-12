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
}: {
	avatar?: string;
	username?: string;
}) => {
	const uname = usernameShorter(username ?? '');
	return (
		<span className="w-12 grid overflow-hidden aspect-square  place-items-center rounded-full bg-slate-100 ">
			{avatar ? <img src={avatar} alt=":profile" /> : uname}
		</span>
	);
};