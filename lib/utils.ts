export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const visit = (value: ClassValue) => {
    if (!value) return;

    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    Object.entries(value).forEach(([key, enabled]) => {
      if (enabled) classes.push(key);
    });
  };

  inputs.forEach(visit);
  return classes.join(" ");
}
