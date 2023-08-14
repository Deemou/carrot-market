export interface IEmailForm {
  email: string;
  formErrors?: string;
}

export interface ILoginForm extends IEmailForm {
  password: string;
}
