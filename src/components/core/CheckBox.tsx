import { HTMLAttributes } from "react"

export const Toggle = ({ id }: HTMLAttributes<HTMLInputElement>) => {
  return <label htmlFor={id}>
    <input type="checkbox" />
  </label>
}