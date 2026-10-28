import Image from "next/image";
import type { SleepingSpace } from "@/types/listing";
import section from "./section.module.css";
import styles from "./Sleeping.module.css";

export function Sleeping({ spaces }: { spaces: SleepingSpace[] }) {
  return (
    <section className={section.block} aria-labelledby="sleeping-heading">
      <h2 id="sleeping-heading" className={`${section.heading} ${section.headingSpacing}`}>
        Where you&apos;ll sleep
      </h2>
      <ul className={styles.spaces}>
        {spaces.map((space) => (
          <li key={space.room}>
            <div className={styles.photo}>
              <Image src={space.photo.src} alt="" fill sizes="318px" className={styles.image} />
            </div>
            <p className={styles.room}>{space.room}</p>
            <p className={styles.beds}>{space.beds}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
