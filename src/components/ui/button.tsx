import type { ButtonHTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "text";

const variantClass: Record<Variant, string> = {
  primary: "rounded-button bg-pure-black px-6 py-3 text-body font-medium text-canvas disabled:opacity-50",
  secondary: "rounded-button border border-ink px-6 py-3 text-body font-medium text-ink disabled:opacity-50",
  text: "text-body font-medium text-ink underline-offset-4 hover:underline",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${variantClass[variant]} ${className ?? ""}`.trim()}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`inline-block text-center ${variantClass[variant]} ${className ?? ""}`.trim()}>
      {children}
    </Link>
  );
}
