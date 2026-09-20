import { useEffect, useRef, useState } from 'react';
import { Mail } from './Icons';

/**
 * L'action principale de la page : l'adresse est écrite sur le bouton,
 * et le bouton voisin la copie dans le presse-papier.
 */
export default function MailButton({ email }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(email);
        } catch {
            // Presse-papier refusé (contexte non sécurisé, permission) : on
            // affiche quand même la confirmation, l'adresse reste lisible.
        }

        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1800);
    }

    return (
        <div className="mailwrap">
            <a className="mailbtn" href={`mailto:${email}`}>
                <Mail />
                {email}
            </a>
            <button
                type="button"
                className="copy"
                onClick={copy}
                data-done={copied ? '1' : undefined}
                aria-label="Copier l'adresse e-mail"
            >
                {copied ? 'copié' : 'copier'}
            </button>
        </div>
    );
}
