/**
 * Les marques et pictogrammes de la page, en SVG inline.
 * `size` permet de réduire une flèche sans toucher au tracé.
 */

export function Arrow({ className = '', size = 16 }) {
    return (
        <svg
            className={className}
            style={{ width: size, height: size }}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
        >
            <path d="M5 11L11 5M11 5H5.8M11 5v5.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function Mail({ size = 16 }) {
    return (
        <svg
            className="glyph"
            style={{ width: size, height: size }}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
        >
            <rect x="2.2" y="4.2" width="15.6" height="11.6" rx="2" />
            <path d="M2.8 5.6 10 10.8l7.2-5.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function Moon() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M13.5 9.8A5.8 5.8 0 0 1 6.2 2.5a5.8 5.8 0 1 0 7.3 7.3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function Sun() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="8" cy="8" r="3.1" />
            <path
                d="M8 1.4v1.6M8 13v1.6M1.4 8h1.6M13 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"
                strokeLinecap="round"
            />
        </svg>
    );
}

const BRANDS = {
    linkedin:
        'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
    x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
};

export function Brand({ name }) {
    const path = BRANDS[name];

    if (!path) {
        return null;
    }

    return (
        <svg className="glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={path} />
        </svg>
    );
}
