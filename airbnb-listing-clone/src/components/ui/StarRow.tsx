import { StarIcon } from "./icons";

export function StarRow({
  count = 5,
  gap = 2,
  size = 10,
}: {
  count?: number;
  gap?: number;
  size?: number;
}) {
  return (
    <span style={{ display: "flex", gap }} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <StarIcon key={i} size={size} />
      ))}
    </span>
  );
}
