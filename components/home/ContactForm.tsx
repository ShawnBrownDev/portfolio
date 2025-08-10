"use client";

import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setSubmitStatus('success');
      setFormData(initialFormData);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-medium text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-lg">
            Have a question or want to work together? Drop me a message!
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-3 rounded-lg bg-[#0A0F1E] border border-slate-800",
                "text-white placeholder:text-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "transition duration-200"
              )}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-3 rounded-lg bg-[#0A0F1E] border border-slate-800",
                "text-white placeholder:text-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "transition duration-200"
              )}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={cn(
                "w-full px-4 py-3 rounded-lg bg-[#0A0F1E] border border-slate-800",
                "text-white placeholder:text-slate-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "transition duration-200",
                "resize-none"
              )}
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full px-6 py-3 rounded-lg",
              "bg-blue-600 hover:bg-blue-700",
              "text-white font-medium",
              "transition duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0A0F1E]"
            )}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'success' && (
            <p className="text-green-500 text-sm text-center mt-4">
              Message sent successfully! I&apos;ll get back to you soon.
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="text-red-500 text-sm text-center mt-4">
              Something went wrong. Please try again later.
            </p>
          )}
        </form>
      </div>
    </section>
  );
} 