import { useEffect, useState } from 'react';
import { Moon, Sun } from './Icons';
import Reveal from './Reveal';

/**
 * Les cercles filaires du fond : des rayons de plusieurs milliers de pixels,
 * recadrés par la fenêtre. C'est le décor, il ne défile pas.
 */
export function Arcs() {
    return (
        <svg className="arcs" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="1240" cy="-180" r="1020" />
            <circle cx="180" cy="1180" r="1080" />
            <circle cx="1560" cy="620" r="520" />
        </svg>
    );
}

/**
 * Onglet fixe en bord droit. Il n'apparaît que si le statut est ouvert :
 * un onglet « Disponible » affiché alors qu'on ne l'est pas serait un piège.
 */
export function SideTab({ status, email }) {
    if (!status?.available) {
        return null;
    }

    return (
        <a className="tab" href={`mailto:${email}`}>
            <span className="tab-dot" aria-hidden="true" />
            {status.label}
        </a>
    );
}

/**
 * Bascule sombre/clair. Sombre par défaut, sans mode automatique : le
 * document ne porte aucun attribut tant que le lecteur n'a pas choisi.
 */
export function ThemeToggle() {
    const [dark, setDark] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <button className="themebtn" type="button" onClick={() => setDark((d) => !d)}>
            {dark ? <Moon /> : <Sun />}
            <span>thème {dark ? 'sombre' : 'clair'}</span>
        </button>
    );
}

/**
 * Bandeau défilant. La piste est doublée pour que la boucle ne saute pas.
 */
export function Marquee({ items }) {
    return (
        <div className="marquee">
            <div className="marquee-track" aria-hidden="true">
                {[...items, ...items].map((item, i) => (
                    <span key={`${item}-${i}`}>{item}</span>
                ))}
            </div>
        </div>
    );
}

/**
 * Titre de section surdimensionné, avec sa révélation masquée.
 * `count` n'est affiché que s'il dit quelque chose de vrai.
 */
export function SectionTitle({ eyebrow, title, count }) {
    return (
        <div className="sec-head">
            <div>
                <p className="label">{eyebrow}</p>
                <Reveal as="h2" className="sec-title mask">
                    <span>
                        {title}
                        {count ? <span className="count">{String(count).padStart(2, '0')}</span> : null}
                    </span>
                </Reveal>
            </div>
        </div>
    );
}
