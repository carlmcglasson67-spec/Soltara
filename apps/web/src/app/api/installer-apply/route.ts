import { NextResponse } from 'next/server';

/** Founding installer applications, delivered by Web3Forms. Refuses clearly if delivery isn't configured. */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Application could not be read.' }, { status: 400 }); }

  if (body.website_url) return NextResponse.json({ ok: true }); // honeypot
  const required = ['company_name', 'name', 'email', 'phone', 'mcs', 'areas'] as const;
  if (required.some((k) => !body[k]?.trim())) return NextResponse.json({ error: 'Fill in every field so we can check your details.' }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email!)) return NextResponse.json({ error: 'That email address doesn’t look right.' }, { status: 400 });

  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    console.error('[installer-apply] WEB3FORMS_ACCESS_KEY not set; application not delivered', { company: body.company_name });
    return NextResponse.json({ error: 'Applications open soon. Please email us in the meantime.' }, { status: 503 });
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: key, subject: `Soltata installer application: ${body.company_name}`, from_name: 'Soltata Energy',
      company: body.company_name, name: body.name, email: body.email, phone: body.phone,
      mcs_number: body.mcs, areas: body.areas, technologies: body.technologies,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: 'We couldn’t send your application just now. Please try again.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
