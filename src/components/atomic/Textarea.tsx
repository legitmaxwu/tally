import React, { forwardRef, HTMLProps, useLayoutEffect, useState } from "react";

import clsx from "clsx";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

type TextAreaProps = TextareaAutosizeProps &
  Omit<HTMLProps<HTMLTextAreaElement>, "style" | "ref"> & {
    onValueChange?: (value: string) => void;
  };

//TODO: Implement color depending on theme
// eslint-disable-next-line react/display-name
const Textarea = forwardRef(
  (
    {
      className = "",
      onValueChange = () => {},
      onChange,
      ...props
    }: TextAreaProps,
    _
  ) => {
    // Hack to make minrows work
    // https://github.com/Andarist/react-textarea-autosize/issues/337#issuecomment-1024980737
    const [, setIsRerendered] = useState(false);
    useLayoutEffect(() => setIsRerendered(true), []);

    const styles = clsx({
      "border border-gray-400 focus:border-black  px-2 py-1 focus:outline-none transition resize-none":
        true,
      [`${className}`]: true,
    });
    return (
      <TextareaAutosize
        minRows={2}
        {...props}
        className={styles}
        onChange={(event) => {
          onValueChange(event.target.value);
          if (onChange) {
            onChange(event);
          }
        }}
      />
    );
  }
);

export default Textarea;
