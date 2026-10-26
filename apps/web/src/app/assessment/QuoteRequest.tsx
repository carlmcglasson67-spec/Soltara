'use client';

import { useState } from 'react';
import s from './assessment.module.css';

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function QuoteRequest({ summary, postcode = '' }: { summary: string; postcode?: string }) {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, summary }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Something went wrong sending your request.');
      setState('sent');
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong sending your request.');
    }
  }

  if (state === 'sent') {
    return (
      <div className={s.quoteBox} role="status">
        <h2 className={s.quoteTitle}>Request received.</h2>
        <p>We’ll check your details and email you within one working day with the installers who cover your area. If we don’t have vetted installers near you yet, we’ll tell you straight away rather than pass you to anyone we haven’t checked. Nobody will call you before you choose.</p>
      </div>
    );
  }

  return (
    <form className={s.quoteBox} onSubmit={submit}>
      <h2 className={s.quoteTitle}>Want real quotes for this?</h2>
      <p>We’ll match you with up to three vetted, MCS-certified installers who cover your area. They quote on one standard form, so you can compare like with like. You choose who, if anyone, visits.</p>
      <div className={s.quoteFields}>
        <label className={s.field}><span>Your name</span><input name="name" required autoComplete="name" /></label>
        <label className={s.field}><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
        <label className={s.field}><span>Postcode</span><input name="postcode" required autoComplete="postal-code" defaultValue={postcode} /></label>
      </div>
      <label className={s.consent}>
        <input type="checkbox" name="consent" required value="yes" />
        <span>Share my assessment with up to three installers I pick. I understand Soltara never sells my details and nobody calls me until I choose.</span>
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <div className={s.submitRow}>
        <button className="btn btn-primary btn-arrow" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending request' : 'Request my quotes'}
        </button>
        {state === 'error' && <p className={s.error} role="alert">{message}</p>}
      </div>
    </form>
  );
}
