import clsx from "clsx";
import { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

//TODO: Implement color depending on theme
const Input = ({ className = "", ...props }: InputProps) => {
  const styles = clsx({
    "border border-gray-400 focus:border-black px-1 focus:outline-none": true,
    [`${className}`]: true,
  });
  return <input {...props} className={styles} />;
};

export default Input;
