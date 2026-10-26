/** Site-wide facts. One place to change when the domain and company details land. */
export const SITE = {
  name: 'Soltara Energy',
  /** Production origin. Change when soltara.co.uk is live. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soltara-silk.vercel.app',
  /** Public contact address. Leave empty until the mailbox exists; the footer hides it when empty. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  /** Legal line in the footer. Update with the company number once registered. */
  legalName: 'Soltara Energy',
  builder: { name: 'Pervonio', url: 'https://pervonio.com' },
};
