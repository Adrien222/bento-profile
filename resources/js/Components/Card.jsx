import Reveal from './Reveal';

/**
 * Conteneur de base de la grille.
 *
 * `span` accepte les classes de colonnes (`c2`, `c4`), `className` les
 * variantes d'anatomie définies dans app.css : `net`, `proj`, `slot`,
 * `panel panel--cobalt`, `panel panel--plain`.
 */
export default function Card({ as = 'section', span = '', className = '', delay = 0, children, ...props }) {
    return (
        <Reveal as={as} delay={delay} className={`cell ${span} ${className}`.replace(/\s+/g, ' ').trim()} {...props}>
            {children}
        </Reveal>
    );
}

/**
 * Carte-lien : la surface entière est cliquable.
 */
export function CardLink({ href, children, ...props }) {
    return (
        <Card as="a" href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </Card>
    );
}
