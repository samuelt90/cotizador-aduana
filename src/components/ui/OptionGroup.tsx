import type { ReactNode } from "react";

type OptionGroupProps = {
  title: string;
  children: ReactNode;
};

export function OptionGroup({ title, children }: OptionGroupProps) {
  return (
    <div className="animate-[fadeUp_0.35s_ease-out]">
      <p className="mb-3 text-sm font-black text-white">{title}</p>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}
