import { IDateTag, IMessage } from 'store';
import { formatDate } from './time';

export const trimChats = (chats: any) => {
	const entries = Object.entries(chats);
	const combinedChats: (IMessage | IDateTag)[] = [];
	for (let i = 0, len = entries.length; i < len; i++) {
		const [date, messages] = entries[i];
		const dateTag = createDateTage(date);
		for (const message of messages as Omit<IMessage, 'modelType'>[]) {
			combinedChats.push({
				...message,
				modelType: 'MESSAGE',
			});
		}
		combinedChats.push(dateTag);
  }
  
  return combinedChats;
};

const createDateTage = (date: string): IDateTag => {
  const id = date + Math.random();
  return {
    _id: id,
		date: formatDate(date),
		modelType: 'DATE',
	};
};
