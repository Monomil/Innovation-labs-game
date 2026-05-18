/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-3xl shadow-lg overflow-hidden group';

  const variants = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600',
    secondary: 'bg-teal-400 text-white hover:bg-teal-500',
    accent: 'bg-yellow-400 text-indigo-900 hover:bg-yellow-500',
    ghost: 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl',
    xl: 'px-10 py-5 text-2xl',
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}

export function Card({ children, className = '', ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={`bg-white/90 backdrop-blur-xl border-4 border-white/50 rounded-[40px] shadow-2xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function FloatingElement({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function Badge({ children, color = 'indigo' }: { children: ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    teal: 'bg-teal-100 text-teal-600 border-teal-200',
    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    red: 'bg-red-100 text-red-600 border-red-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  );
}
