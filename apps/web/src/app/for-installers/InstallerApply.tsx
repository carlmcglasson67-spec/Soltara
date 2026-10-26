'use client';

import { useState } from 'react';
import s from './installers.module.css';

type State = 'idle' | 'sending' | 'sent' | 'error';
const TECH = ['Solar PV', 'Batteries', 'EV chargers', 'Heat pumps'];

export default function InstallerApply() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const fd = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(fd), technologies: fd.getAll('technologies').join(', ') };
    try {
      const res = await fetch('/api/installer-apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Something went wrong sending your application.');
      setState('sent');
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong sending your application.');
    }
  }

  if (state === 'sent') {
    return (
      <div className={s.form} role="status">
        <p className={s.done}>Application received. We’ll be in touch within two working days to arrange a call.</p>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={submit}>
      <label className={s.field}><span>Company name</span><input name="company_name" required autoComplete="organization" /></label>
      <label className={s.field}><span>Your name</span><input name="name" required autoComplete="name" /></label>
      <label className={s.field}><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
      <label className={s.field}><span>Phone</span><input name="phone" type="tel" required autoComplete="tel" /></label>
      <label className={s.field}><span>MCS certificate number</span><input name="mcs" required /></label>
      <label className={s.field}><span>Areas you cover</span><input name="areas" required placeholder="For example: West Cumbria, Carlisle, South Lakes" /></label>
      <fieldset className={s.techs}>
        <legend>What you install</legend>
        {TECH.map((t) => (
          <label key={t}><input type="checkbox" name="technologies" value={t} defaultChecked={t === 'Solar PV'} /> {t}</label>
        ))}
      </fieldset>
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <div className={s.submitRow}>
        <button className="btn btn-primary btn-arrow" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending application' : 'Send application'}
        </button>
        {state === 'error' && <p className={s.error} role="alert">{message}</p>}
      </div>
    </form>
  );
}
