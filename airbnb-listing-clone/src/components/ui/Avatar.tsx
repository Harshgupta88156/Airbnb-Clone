import Image from "next/image";
import type { Person } from "@/types/listing";
import styles from "./Avatar.module.css";

export function Avatar({ person, size }: { person: Person; size: number }) {
  if (person.avatar) {
    return (
      <Image
        src={person.avatar}
        alt=""
        width={size}
        height={size}
        className={styles.photo}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={styles.initial}
      data-tone={person.tone ?? "peach"}
      style={{ width: size, height: size, fontSize: Math.floor(size * 0.41) }}
      aria-hidden="true"
    >
      {person.name.charAt(0)}
    </span>
  );
}
