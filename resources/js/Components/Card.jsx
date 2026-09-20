/**
 * Conteneur de base de la grille. `span` accepte des classes de
 * colonnes/lignes Tailwind pour composer le pavage bento.
 */
export default function Card({ span = '', className = '', children }) {
    return (
        <section
            className={`rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm
                        dark:border-neutral-800 dark:bg-neutral-900 ${span} ${className}`}
        >
            {children}
        </section>
    );
}
