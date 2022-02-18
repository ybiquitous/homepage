declare module "@fortawesome/fontawesome-svg-core/import.macro" {
  import type { IconName, IconProp } from "@fortawesome/fontawesome-svg-core";

  export function brands(iconName: IconName): IconProp;
  export function solid(iconName: IconName): IconProp;
  export function reqular(iconName: IconName): IconProp;
}
