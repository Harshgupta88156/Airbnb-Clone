import type { ThingsToKnowGroup } from "@/types/listing";
import { Glyph } from "@/components/ui/icons";
import { PlaceholderLink } from "@/components/ui/PlaceholderLink";
import buttons from "@/components/ui/buttons.module.css";
import section from "./section.module.css";
import styles from "./ThingsToKnow.module.css";

export function ThingsToKnow({ groups }: { groups: ThingsToKnowGroup[] }) {
  return (
    <section className={section.wide} aria-labelledby="things-to-know-heading">
      <h2 id="things-to-know-heading" className={section.heading}>
        Things to know
      </h2>
      <div className={styles.groups}>
        {groups.map((group) => (
          <div key={group.title}>
            <Glyph name={group.icon} />
            <h3 className={styles.title}>{group.title}</h3>
            {group.lines.map((line) => (
              <p key={line} className={styles.line}>
                {line}
              </p>
            ))}
            <p className={styles.more}>
              <PlaceholderLink className={buttons.link}>
                Learn more
                <span className="visually-hidden"> about {group.title.toLowerCase()}</span>
              </PlaceholderLink>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
