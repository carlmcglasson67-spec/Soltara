import { NextResponse } from 'next/server';

/**
 * Quote requests (Phase 1, run by hand): the request is emailed to Soltata, who matches installers manually.
 * Delivery uses Web3Forms when WEB3FORMS_ACCESS_KEY is set. Without it the route refuses clearly rather than
 * pretending to send, so a request is never silently lost.
 */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Request could not be read.' }, { status: 400 }); }

  if (body.company) return NextResponse.json({ ok: true }); // honeypot: silently accept bots
  const { name, email, postcode, consent, summary } = body;
  if (!name || !email || !postcode) return NextResponse.json({ error: 'Add your name, email and postcode.' }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: 'That email address doesn’t look right.' }, { status: 400 });
  if (consent !== 'yes') return NextResponse.json({ error: 'Tick the box to let us share your assessment with installers you pick.' }, { status: 400 });

  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    console.error('[quote-request] WEB3FORMS_ACCESS_KEY not set; request not delivered', { postcode, summary });
    return NextResponse.json({ error: 'Quote requests open soon. Please try again in a few days.' }, { status: 503 });
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: key,
      subject: `Soltata quote request: ${postcode}`,
      from_name: 'Soltata Energy',
      name, email, postcode, assessment: summary,
      consent: 'Shared with up to three installers the homeowner picks; no calls before they choose',
    }),
  });
  if (!res.ok) return NextResponse.json({ error: 'We couldn’t send your request just now. Please try again.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
