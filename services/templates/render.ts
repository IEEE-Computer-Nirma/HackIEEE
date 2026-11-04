import { renderRegistrationEmail, RegistrationEmailData } from "./registration-confirmation";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Renders the Registration Confirmation Email to HTML & Plain Text
 * Uses the authentic Dune Rise & website palette template.
 */
export async function renderRegistrationConfirmationEmail(
  data: RegistrationEmailData
): Promise<RenderedEmail> {
  return renderRegistrationEmail(data);
}
