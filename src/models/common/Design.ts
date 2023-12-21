export const AppearanceCode = {
  OUT_LINE: 'Outline',
  UNDER_LINE: 'Underline',
  CONTAINED: 'Contained',
} as const;

export const SortDirectionCode = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const SizeCode = {
  XS: 'XS',
  SM: 'SM',
  MD: 'MD',
  LG: 'LG',
  XL: 'XL',
} as const;

export const GapCode = {
  XS: 'XS',
  SM: 'SM',
  MD: 'MD',
  LG: 'LG',
  XL: 'XL',
} as const;

export const AlignCode = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export const AlignItemsCode = {
  START: 'Start',
  CENTER: 'Center',
  END: 'End',
  STRETCH: 'Stretch',
  BASELINE: 'Baseline',
} as const;

export const VariantCode = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  BODY1: 'body1',
  BODY2: 'body2',
  CAPTION: 'caption',
} as const;

export const ShapeCode = {
  ROUND: 'Round',
  SQUARE: 'Square',
} as const;

export const StatusCode = {
  DEFAULT: 'default',
  ERROR: 'error',
  CONFIRMED: 'confirmed',
} as const;

export const DirectionCode = {
  HORIZONTAL: 'Horizontal',
  VERTICAL: 'Vertical',
} as const;

export const JustifyContentCode = {
  START: 'Start',
  CENTER: 'Center',
  END: 'End',
  BETWEEN: 'Between',
  EVENLY: 'Evenly',
} as const;

export const PriorityCode = {
  PRIMARY: 'Primary',
  NORMARL: 'Normal',
} as const;

export const ButtonTypeCode = {
  SUBMIT: 'submit',
  RESET: 'reset',
  BUTTON: 'button',
} as const;

export const ValidationCode = {
  DEFAULT: 'Default',
  ERROR: 'Error',
  CONFIRM: 'Confirm',
} as const;

export const CheckedCode = {
  INDETERMINATE: 'indeterminate',
} as const;

export type Appearance = (typeof AppearanceCode)[keyof typeof AppearanceCode];
export type Size = (typeof AppearanceCode)[keyof typeof AppearanceCode];
export type Gap = (typeof GapCode)[keyof typeof GapCode];
export type Align = (typeof AlignCode)[keyof typeof AlignCode];
export type AlignItems = (typeof AlignItemsCode)[keyof typeof AlignItemsCode];
export type Variant = (typeof VariantCode)[keyof typeof VariantCode];
export type Shape = (typeof ShapeCode)[keyof typeof ShapeCode];
export type Status = (typeof StatusCode)[keyof typeof StatusCode];
export type Direction = (typeof DirectionCode)[keyof typeof DirectionCode];
export type JustifyContent = (typeof JustifyContentCode)[keyof typeof JustifyContentCode];
export type Priority = (typeof PriorityCode)[keyof typeof PriorityCode];
export type ButtonType = (typeof ButtonTypeCode)[keyof typeof ButtonTypeCode];
export type Validation = (typeof ValidationCode)[keyof typeof ValidationCode];
export type SortDirection = (typeof SortDirectionCode)[keyof typeof SortDirectionCode] | undefined;
export type CheckedState = boolean | (typeof CheckedCode)[keyof typeof CheckedCode];
export type Required = boolean;
export type Selected = boolean;
export type Disabled = boolean;
export type FixedSize = boolean;
