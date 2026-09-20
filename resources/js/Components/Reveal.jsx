import { useEffect, useRef } from 'react';

/**
 * Révèle son contenu à l'entrée dans le champ de vision, une seule fois.
 *
 * Rend l'élément demandé plutôt qu'une enveloppe : la carte reste un enfant
 * direct de la grille, et ses `grid-column` continuent de s'appliquer.
 */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, style = {}, children, ...props }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;

        if (!el) {
            return;
        }

        // Sans IntersectionObserver, on montre tout plutôt que rien.
        if (typeof IntersectionObserver === 'undefined') {
            el.classList.add('in');

            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }

                el.classList.add('in');
                observer.disconnect();
            },
            { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <Tag ref={ref} className={`rv ${className}`.trim()} style={{ '--d': `${delay}s`, ...style }} {...props}>
            {children}
        </Tag>
    );
}
