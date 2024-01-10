import { DateRange } from "./date-range.interface";
import { Filter } from "./filter.interface";

export interface FilterApplied {
  dateRange: DateRange;
  filter: Filter;
}
