/**
 * Bouton d'action sortant. Les liens externes reçoivent rel="noopener"
 * pour éviter que la page cible accède à window.opener.
 */
export default function LinkButton({ href, children, variant = 'solid' }) {
    const styles = {
        solid: 'bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200',
        ghost: 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800',
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm
                        font-medium transition-colors ${styles[variant]}`}
        >
            {children}
            <span aria-hidden="true">↗</span>
        </a>
    );
}
