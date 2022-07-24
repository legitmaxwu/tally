import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "medium" | "small";
};
// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  (
    { className, size = "medium", ...props }: ButtonProps,
    _ //ref: creating this so the warning of passing refs with Links disappears
  ) => {
    const styles = clsx({
      ["bg-slate-600 border border-black text-white px-2 py-1 rounded-sm hover:bg-slate-500 transition shadow-lg"]:
        true,
      ["text-sm py-0.5 px-1"]: size === "small",
      [`${className}`]: true,
    });

    return <button className={styles} {...props} />;
  }
);

export default Button;
