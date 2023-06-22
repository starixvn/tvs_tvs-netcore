export enum ModalType {
  Error,
  Alert,
  Warning,
  Confirm,
  ConfirmThreeButton
}

export interface Content {
  title?: string;
  message?: string;
}

export interface IModal {
  title?: string;
  message?: string;
  type?: ModalType;
  copyContent?: boolean;
  content?: Content[];
}