import { EN_US } from 'languages';
import Google from 'assets/svg/google.svg';

export const GoogleAuth = () => {
  return (
		<section className="flex flex-col">
			<button className="border flex justify-center items-center shadow p-3 font-medium text-sm rounded-lg">
				<img className="h-6 mr-1" src={Google} alt="google" />
				{EN_US['login.Google']}
			</button>
		</section>
	);
}
