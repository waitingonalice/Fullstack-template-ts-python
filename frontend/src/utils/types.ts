export interface Option {
  label: string;
  value: string;
  renderLabel?: (label: string) => React.ReactNode;
}
