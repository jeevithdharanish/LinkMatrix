'use client';
import { useEffect, useRef } from 'react';

/**
 * ScrollReveal — wraps children and animates them into view
 * when the user scrolls to them, using Intersection Observer.
 *
 * Props:
 *  - animation: 'fade-up' | 'slide-left' | 'slide-right' | 'scale-up' | 'flip-up' (default: 'fade-up')
 *  - delay: ms delay before animation starts (default: 0)
 *  - duration: ms animation duration (default: 700)
 *  - threshold: 0–1 visibility fraction to trigger (default: 0.15)
 *  - stagger: ms increment per child (used for lists; default: 0)
 *  - staggerIndex: which child this is (for parent-managed stagger)
 *  - once: only animate once (default: true)
 *  - className: additional classes
 *  - as: wrapper element tag (default: 'div')
 */
export default function ScrollReveal({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 700,
    threshold = 0.15,
    stagger = 0,
    staggerIndex = 0,
    once = true,
    className = '',
    as: Tag = 'div',
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('scroll-revealed');
                    if (once) observer.unobserve(el);
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    const totalDelay = delay + stagger * staggerIndex;

    return (
        <Tag
            ref={ref}
            className={`scroll-reveal scroll-reveal--${animation} ${className}`}
            style={{
                '--reveal-delay': `${totalDelay}ms`,
                '--reveal-duration': `${duration}ms`,
            }}
        >
            {children}
        </Tag>
    );
}
