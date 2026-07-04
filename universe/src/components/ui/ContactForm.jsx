import { useState } from 'react';
import emailjs from '@emailjs/browser';

// TODO: replace with your real EmailJS service/template/public keys.
// Sign up at https://www.emailjs.com/ — the free tier is enough for a portfolio.
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
        // Keys not configured yet — simulate success so the UI can be reviewed.
        await new Promise((r) => setTimeout(r, 900));
      } else {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY);
      }
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-ion/20 flex items-center justify-center text-ion text-2xl">✓</div>
        <p className="font-mono text-ion text-sm uppercase tracking-widest">Transmission Received</p>
        <p className="text-white/60 text-sm">Thanks for reaching out — I'll reply as soon as possible.</p>
        <button onClick={() => setStatus('idle')} className="mt-2 text-xs font-mono text-white/40 underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          required
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="bg-white/5 border border-white/10 focus:border-ion/60 rounded px-3 py-2 text-sm outline-none transition-colors"
        />
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your email"
          className="bg-white/5 border border-white/10 focus:border-ion/60 rounded px-3 py-2 text-sm outline-none transition-colors"
        />
      </div>
      <input
        required
        name="subject"
        value={form.subject}
        onChange={handleChange}
        placeholder="Subject"
        className="bg-white/5 border border-white/10 focus:border-ion/60 rounded px-3 py-2 text-sm outline-none transition-colors"
      />
      <textarea
        required
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Message"
        rows={4}
        className="bg-white/5 border border-white/10 focus:border-ion/60 rounded px-3 py-2 text-sm outline-none transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="self-start px-5 py-2 rounded-full bg-ion text-void font-mono text-[10px] uppercase tracking-widest font-semibold shadow-glow-ion hover:scale-105 transition-transform disabled:opacity-50"
      >
        {status === 'sending' ? 'Transmitting...' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-alert text-xs font-mono">Transmission failed — check your EmailJS keys and try again.</p>
      )}
    </form>
  );
}
