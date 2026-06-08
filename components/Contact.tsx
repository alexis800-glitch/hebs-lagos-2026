"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Mail, Phone, MessageCircle, Send, CheckCircle } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const EASE = [0.25, 0.4, 0.25, 1] as const;

export default function Contact() {
  const mounted = useMounted();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#ffffff",
    fontSize: "0.9rem",
    fontFamily: "var(--font-inter), sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const contactItems = [
    {
      icon: MapPin,
      label: "Venue",
      value: "NJS Royale Convention & Suites, Lagos, Nigeria",
      color: "#e91e8c",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@thehebs.com",
      href: "mailto:info@thehebs.com",
      color: "#9b59b6",
    },
    {
      icon: Phone,
      label: "Phone (US)",
      value: "484-357-1812",
      href: "tel:+14843571812",
      color: "#9b59b6",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us on WhatsApp",
      href: "https://wa.me/14843571812",
      color: "#25D366",
    },
  ];

  return (
    <section id="contact" className="py-24 px-4" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 30 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-16"
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] mb-4 font-inter"
            style={{ color: "#9b59b6" }}
          >
            Get In Touch
          </p>
          <h2 className="section-title text-white mb-4">
            Contact &amp;{" "}
            <span className="gradient-text italic">Inquiries</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Have questions about HEBS 2026? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — contact info */}
          <motion.div
            initial={mounted ? { opacity: 0, x: -30 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col gap-5"
          >
            <h3 className="font-playfair font-bold text-2xl text-white mb-2">
              Event Information
            </h3>

            {contactItems.map(({ icon: Icon, label, value, href, color }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{
                  background: "rgba(22,22,22,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                  }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p
                    className="text-xs uppercase tracking-widest font-inter mb-1"
                    style={{ color: "#555" }}
                  >
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium font-inter transition-colors"
                      style={{ color: "#cccccc" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "#cccccc")
                      }
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium font-inter" style={{ color: "#cccccc" }}>
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right — inquiry form */}
          <motion.div
            initial={mounted ? { opacity: 0, x: 30 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-2xl p-8"
            style={{
              background: "rgba(22,22,22,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(155,89,182,0.2)",
            }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center"
              >
                <CheckCircle size={48} style={{ color: "#9b59b6" }} />
                <h3 className="font-playfair font-bold text-2xl text-white">
                  Message Sent!
                </h3>
                <p className="font-inter text-sm" style={{ color: "#aaaaaa" }}>
                  Thank you for reaching out. We&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="btn-outline text-sm mt-2"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-playfair font-bold text-xl text-white mb-1">
                  Send an Inquiry
                </h3>

                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2 font-inter"
                    style={{ color: "#555" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    style={inputBase}
                    onFocus={(e) =>
                      ((e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(155,89,182,0.6)")
                    }
                    onBlur={(e) =>
                      ((e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2 font-inter"
                    style={{ color: "#555" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    style={inputBase}
                    onFocus={(e) =>
                      ((e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(155,89,182,0.6)")
                    }
                    onBlur={(e) =>
                      ((e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-xs uppercase tracking-widest mb-2 font-inter"
                    style={{ color: "#555" }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    required
                    rows={5}
                    style={{ ...inputBase, resize: "none" }}
                    onFocus={(e) =>
                      ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                        "rgba(155,89,182,0.6)")
                    }
                    onBlur={(e) =>
                      ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pink flex items-center justify-center gap-2 text-sm mt-1"
                  style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "wait" : "pointer" }}
                >
                  {submitting ? (
                    "Sending…"
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
