import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { triggerConfetti } from '../../utils/confetti';

export const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { postContact } = useApi();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Sending message...');
    try {
      const response = await postContact(data);
      if (response.data.success) {
        toast.success(response.data.data.message || 'Message sent successfully!', { id: toastId });
        triggerConfetti();
        
        // Redirect/send message directly to WhatsApp
        const { name, email, subject, message } = data;
        const textMessage = `Hello Jeshintha, a new contact message has been submitted from your portfolio:\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n*Message:* ${message}`;
        const whatsappUrl = `https://wa.me/918939014733?text=${encodeURIComponent(textMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        reset();
      } else {
        toast.error(response.data.error || 'Failed to send message', { id: toastId });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Exceeded rate limits or server encountered an error.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address'
            }
          })}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject', { required: 'Subject is required' })}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="What is this regarding?"
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows="5"
          {...register('message', { 
            required: 'Message is required',
            minLength: {
              value: 10,
              message: 'Message must be at least 10 characters long'
            }
          })}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
          placeholder="Describe your inquiry..."
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 hover:text-white transition-all neon-glow neon-glow-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
export default ContactForm;
