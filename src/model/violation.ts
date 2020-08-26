export interface Violation {
  message: string;
  code: string;
  invalidValue: string;
  messageTemplate: string;
  parameters: { [key: string]: string };
  propertyPath: string;
}
