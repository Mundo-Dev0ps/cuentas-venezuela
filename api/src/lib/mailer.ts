/**
 * Cloudflare Email Workers helper — sends one notification email from
 * reportes@cuentasvenezuela.org to whichever verified address is bound
 * in wrangler.toml ([[send_email]] destination_address).
 *
 * Failures are silent: the API must not fail just because a notification
 * couldn't go out. They are logged for tail observation instead.
 */

import { createMimeMessage } from "mimetext";

const FROM_ADDRESS = "reportes@cuentasvenezuela.org";
const FROM_NAME = "Cuentas Venezuela";

interface SendEmailBinding {
  send: (message: unknown) => Promise<void>;
}

interface NotifyArgs {
  binding: SendEmailBinding | undefined;
  to: string;
  subject: string;
  /** plain-text body */
  body: string;
}

export async function notify({ binding, to, subject, body }: NotifyArgs): Promise<boolean> {
  if (!binding) {
    console.warn("[mailer] SEND_EMAIL binding missing — skipping notification");
    return false;
  }
  try {
    const msg = createMimeMessage();
    msg.setSender({ name: FROM_NAME, addr: FROM_ADDRESS });
    msg.setRecipient(to);
    msg.setSubject(subject);
    msg.addMessage({ contentType: "text/plain", data: body });

    // Lazy import so Node dev-server never tries to load the CF runtime module.
    // @ts-expect-error — virtual module, only resolvable inside the Workers bundle.
    const { EmailMessage } = await import("cloudflare:email");
    const message = new EmailMessage(FROM_ADDRESS, to, msg.asRaw());
    await binding.send(message);
    return true;
  } catch (e) {
    console.error("[mailer] send failed:", (e as Error).message);
    return false;
  }
}
