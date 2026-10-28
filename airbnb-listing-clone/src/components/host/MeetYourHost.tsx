import Image from "next/image";
import type { Listing } from "@/types/listing";
import { Avatar } from "@/components/ui/Avatar";
import { Glyph, VerifiedBadgeIcon } from "@/components/ui/icons";
import section from "@/components/listing/section.module.css";
import styles from "./MeetYourHost.module.css";

export function MeetYourHost({ host }: { host: Listing["host"] }) {
  const stats = [
    { label: "Reviews", value: host.reviewCount },
    { label: "Rating", value: `${host.rating}★` },
    { label: "Years hosting", value: host.yearsHosting },
  ];

  return (
    <section className={section.wide} aria-labelledby="host-heading">
      <h2 id="host-heading" className={section.heading}>
        Meet your host
      </h2>

      <div className={styles.layout}>
        <div>
          <div className={styles.card}>
            <div className={styles.identity}>
              <div className={styles.portrait}>
                <Image src={host.avatar} alt="" width={88} height={88} className={styles.avatar} />
                <span className={styles.verified}>
                  <VerifiedBadgeIcon />
                </span>
              </div>
              <h3 className={styles.name}>{host.name}</h3>
              <p className={styles.role}>
                Host<span className="visually-hidden">, identity verified</span>
              </p>
            </div>
            {/* Label first in the markup so it's read before the number; CSS puts the number on top. */}
            <dl className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <dt className={styles.statLabel}>{stat.label}</dt>
                  <dd className={styles.statValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className={styles.facts}>
            {host.facts.map((fact) => (
              <li key={fact.text} className={styles.fact}>
                <Glyph name={fact.icon} />
                {fact.text}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={styles.subheading}>Co-Hosts</h3>
          <ul className={styles.coHosts}>
            {host.coHosts.map((coHost) => (
              <li key={coHost.name} className={styles.coHost}>
                <Avatar person={coHost} size={34} />
                {coHost.name}
              </li>
            ))}
          </ul>

          <h3 className={`${styles.subheading} ${styles.details}`}>Host details</h3>
          <p className={styles.response}>
            Response rate: {host.responseRate}
            <br />
            {host.responseTime}
          </p>
          <button type="button" className={styles.message}>
            Message host
          </button>
          <p className={styles.payment}>
            <Glyph name="shield" />
            To help protect your payment, always use Airbnb to send money and communicate with
            hosts.
          </p>
        </div>
      </div>
    </section>
  );
}
