import type { ButtonHTMLAttributes } from "react";
import styles from "./ReserveButton.module.css";

export function ReserveButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${styles.reserve} ${className}`} {...props}>
      Reserve
    </button>
  );
}
