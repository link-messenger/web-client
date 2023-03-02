import { PropsWithChildren } from "react"

export const Tag = ({children }: PropsWithChildren) => {
  return <div className="bg-gray-100 py-0.5 px-2.5 rounded-full text-sm">
    {children}
  </div>
}