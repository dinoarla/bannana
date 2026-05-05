export * from "./api.types";
export * from "./block.types";

export type ThemeId =
  | "classic"
  | "night"
  | "vanilla"
  | "peach"
  | "matcha"
  | "blueberry"
  | "strawberry"
  | "licorice"
  | "rainbow"
  | "cloud"
  | "pumpkin"
  | "glitter";

export type DashboardTotals = {
  views: number;
  clicks: number;
  ctr: number;
  uniqueVisitors: number;
};
