'use client';

import React, { useState, useEffect } from 'react';

interface ProtectedEmailProps {
  user: string;
  domain: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * Renders contact emails for real visitors while protecting them from
 * automated scrapers, crawlers, and data-mining bots.
 *
 * Example usage:
 * <ProtectedEmail user="shankaran.iyer" domain="christuniversity.in" className="text-sm" />
 */
export function ProtectedEmail({
  user,
  domain,
  className = '',
  showIcon = true,
}: ProtectedEmailProps) {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Dynamically assemble email address only on the client after hydration
    setEmail(`${user}@${domain}`);
  }, [user, domain]);

  if (!email) {
    // Initial SSR output contains no scrapeable email string
    return (
      <span className={`inline-flex items-center gap-2 opacity-60 ${className}`}>
        {showIcon && <span className="inline-block w-4 h-4 rounded bg-gray-400/20 animate-pulse" />}
        <span>Loading contact...</span>
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className={`inline-flex items-center gap-2 transition-colors hover:underline ${className}`}
      rel="nofollow noopener noreferrer"
    >
      {showIcon && (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          className="w-4 h-4 flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" />
        </svg>
      )}
      <span>{email}</span>
    </a>
  );
}

interface ProtectedPhoneProps {
  countryCode: string;
  number: string;
  className?: string;
  showIcon?: boolean;
}

/**
 * Renders phone numbers safely to avoid automated spam dialer harvesting.
 *
 * Example usage:
 * <ProtectedPhone countryCode="+91" number="8291200603" className="text-sm" />
 */
export function ProtectedPhone({
  countryCode,
  number,
  className = '',
  showIcon = true,
}: ProtectedPhoneProps) {
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    // Formats into readable +91 82912 00603 dynamically on client
    const formatted = `${countryCode} ${number.slice(0, 5)} ${number.slice(5)}`;
    setPhone(formatted);
  }, [countryCode, number]);

  if (!phone) {
    return (
      <span className={`inline-flex items-center gap-2 opacity-60 ${className}`}>
        {showIcon && <span className="inline-block w-4 h-4 rounded bg-gray-400/20 animate-pulse" />}
        <span>Loading phone...</span>
      </span>
    );
  }

  const rawTel = `${countryCode}${number}`;

  return (
    <a
      href={`tel:${rawTel}`}
      className={`inline-flex items-center gap-2 transition-colors hover:underline ${className}`}
      rel="nofollow noopener noreferrer"
    >
      {showIcon && (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          className="w-4 h-4 flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
        </svg>
      )}
      <span>{phone}</span>
    </a>
  );
}
