import { Heading, type HeadingProps } from "@radix-ui/themes";
import type { ReactNode } from "react";

type DefaultHeadingProps = HeadingProps & {
  children: ReactNode;
};

export default function DefaultHeading({ children, size = "9", style, ...rest }: DefaultHeadingProps) {
  return (
    <Heading
      size={size}
      style={{
        textTransform: "uppercase",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Heading>
  );
}