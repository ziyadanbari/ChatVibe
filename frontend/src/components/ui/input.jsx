import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = React.forwardRef(
  (
    {
      className,
      type,
      domBefore,
      domAfter,
      containerClassName,
      showOnOffEye = true,
      ...props
    },
    ref
  ) => {
    const [hidePassword, setHidePassword] = React.useState(true);
    return (
      <div className={cn("relative flex items-center", containerClassName)}>
        {domBefore}
        <input
          type={
            type === "password" ? (hidePassword ? "password" : "text") : type
          }
          className={cn(
            "flex h-10 w-full rounded-md border border-main-gray bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {showOnOffEye && type === "password" ? (
          <div className="absolute top-2/4 right-2 -translate-y-2/4 cursor-pointer">
            <div onClick={() => setHidePassword((e) => !e)}>
              {hidePassword ? <EyeOff /> : <Eye />}
            </div>
          </div>
        ) : null}
        {domAfter}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
