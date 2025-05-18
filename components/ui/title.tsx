"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import { HTMLAttributes } from "react";
import { useSidebar } from "./sidebar";

const titleVariants = cva("font-semibold tracking-wide", {
  variants: {
    size: {
      sm: "text-base",
      default: "text-xl",
      lg: "text-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type TitleProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof titleVariants> & {
    className?: string;
  };

const Title = ({ className, size }: TitleProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn(
        titleVariants({ size }),
        className,
        "flex items-center gap-2",
      )}
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={25}
        height={25}
        className="object-cover"
      />
      <span
        className={cn("text-primary font-semibold", isCollapsed && "hidden")}
      >
        Waroeng US
      </span>
    </div>
  );
};

export default Title;
