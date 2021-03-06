// GET /admin/slots
// Returns an array of Automat slots.
type Slots = Slot[];
export interface Slot {
  id: string;
  name: string;
  testCount?: number;
}

// GET /admin/slots/:slotId/tests
// Returns an array of tests under the slot.
// PUT /admin/slots/:slotId/tests
// Updates the array of tests under the slot.
export interface Test {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  created: Date | string;
  startDate?: Date;
  expiryDate?: Date;
  author: {
    id: string; // Likely email address
    firstName: string;
    lastName: string;
  };
  variants: string[]; // Array of variant IDs (components)
  filters: TestFilter[];
}

export interface TestFilter {
  filterId: string;
  selectedOptionIds: string[]; // Allow one or multiple entries depending on allowMultiple boolean in Filter
}

// GET /admin/filters
type Filters = Filter[];
export interface Filter {
  id: string;
  name: string;
  helpText: string;
  options: FilterOption[];
  allowMultiple: boolean; // Default to false?
  selectedOptionIds?: string[];
  control: FilterControl;
}
export interface FilterOption {
  value: string;
  label: string;
}

export type FilterControl = 'options' | 'slider' | 'input';

// GET /admin/variants
type Variants = Variant[];
export interface Variant {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  isEditing?: boolean;
}

// Form validation - defines fields under validation rules
export type TestErrors = { [key: string]: ValidatedFields };
export type ValidatedFields = {
  name?: string;
  variants?: string;
};
