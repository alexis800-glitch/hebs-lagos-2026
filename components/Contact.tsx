"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Mail, Phone, MessageCircle, CheckCircle } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

const contactItems = [
  {
    icon: MapPin,
    label: "Venue",
    value: "NJS Royale Convention & Suites, Lagos, Nigeria",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@thehebs.com",
    href: "mailto:info@thehebs.com",
  },
  {
    icon: Phone,
    label: "Phone (US)",
    value: "484-357-1812",
    href: "tel:+14843571812",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us on WhatsApp",
    href: "https://wa.me/14843571812",
  },
];

const inputClass =
  "bg-transparent border-b border-neutral-800 focus:border-white rounded-none outline-none py-3 w-full transition-colors duration-200 font-sans text-sm text-white placeholder:text-neutral-600";

const labelClass = "block font-sans text-[10px] uppercase tracking-widest text-neutral-600 mb-2";

export default function Contact() {
  const mounted = useMounted();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section id="contact" className="py-24 px-4 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="border-b border-neutral-900 pb-10 mb-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mb-3">
              Get In Touch
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight">
              Contact &amp;{" "}
              <em className="font-normal italic">Inquiries</em>
            </h2>
          </div>
          <p className="font-sans text-sm font-light text-neutral-400 max-w-xs leading-relaxed">
            Have questions about HEBS 2026? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-900">
          {/* Left — contact info */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="p-10 md:p-12 flex flex-col"
          >
            <h3 className="font-serif text-xl font-light text-white mb-8">
              Event Information
            </h3>
            <div className="flex flex-col divide-y divide-neutral-900">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 py-5">
                  <Icon size={14} className="text-neutral-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-sans text-sm text-neutral-300 hover:text-white transition-colors duration-200"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-neutral-300">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — inquiry form */}
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="p-10 md:p-12"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col gap-4 py-12"
              >
                <CheckCircle size={32} className="text-neutral-400" />
                <h3 className="font-serif text-2xl font-light text-white">Message Sent</h3>
                <p className="font-sans text-sm font-light text-neutral-500">
                  Thank you for reaching out. We&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="font-sans text-xs uppercase tracking-widest text-white border-b border-neutral-700 hover:border-white pb-1 w-fit transition-colors duration-200 mt-4"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                <h3 className="font-serif text-xl font-light text-white">Send an Inquiry</h3>

                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-none bg-white text-black text-xs uppercase tracking-widest py-4 px-8 w-full hover:bg-neutral-200 transition-colors duration-200 font-sans font-medium mt-1 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
