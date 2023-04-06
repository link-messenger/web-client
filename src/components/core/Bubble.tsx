import { PropsWithChildren } from "react"

interface ChatBubbleProps extends PropsWithChildren { 
  isRight?: boolean
}
export const ChatBubble = ({ children , isRight=false}: ChatBubbleProps ) => {
  return (
    <section
      className={
        'bg-gray-500 w-fit max-w-xs py-1 text-left px-3 text-white' +
        (isRight
          ? ' rounded-lg rounded-br-none ml-auto justify-end'
          : ' rounded-lg rounded-bl-none')
      }
    >
      {children}
    </section>
  );
}