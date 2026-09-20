import { useEffect, useState } from 'react';
import Card, { CardLink } from './Card';
import { Arrow, Brand } from './Icons';

export function PhotoCard({ src, alt, delay = 0 }) {
    return (
        <Card className="photo-cell" delay={delay}>
            <img className="photo" src={src} alt={alt} width="400" height="400" />
        </Card>
    );
}

export function StatusCard({ status, delay = 0 }) {
    return (
        <Card delay={delay}>
            <p className="label">Statut</p>
            <p className="status-line">
                {status.available ? <span className="dot" aria-hidden="true" /> : null}
                {status.label}
            </p>
            <p className="sub">{status.note}</p>
        </Card>
    );
}

export function ClockCard({ timezone, delay = 0 }) {
    const [time, setTime] = useState('--:--');

    useEffect(() => {
        const format = new Intl.DateTimeFormat('fr-FR', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        const tick = () => setTime(format.format(new Date()));

        tick();
        const id = setInterval(tick, 10000);

        return () => clearInterval(id);
    }, [timezone]);

    return (
        <Card delay={delay}>
            <p className="label">Heure locale</p>
            <p className="clock">{time}</p>
            <p className="sub" style={{ marginTop: 8 }}>
                {timezone.replace('/', ' / ')}
            </p>
        </Card>
    );
}

export function LocationCard({ location, note, delay = 0 }) {
    return (
        <Card delay={delay}>
            <p className="label">Basé en</p>
            <p className="status-line" style={{ marginBottom: 6 }}>
                {location}
            </p>
            <p className="sub">{note}</p>
        </Card>
    );
}

/**
 * Panneau pleine largeur. `tone` vaut `cobalt` pour le moment appuyé de la
 * page, `plain` pour les autres. Un `href` rend le panneau entier cliquable.
 */
export function Panel({ tone = 'plain', eyebrow, title, description, stats = [], cta, href, delay = 0 }) {
    const Wrapper = href ? CardLink : Card;
    const props = href ? { href } : {};

    return (
        <Wrapper span="c4" className={`panel panel--${tone}`} delay={delay} {...props}>
            <div>
                <p className="label">{eyebrow}</p>
                <p className="panel-name">{title}</p>
                <p className="panel-desc">{description}</p>
            </div>
            <div className="panel-side">
                {stats.map((stat) => (
                    <dl className="panel-stat" key={stat.label}>
                        <dt>{stat.label}</dt>
                        <dd>{stat.value}</dd>
                    </dl>
                ))}
                {cta ? (
                    <span className="panel-go">
                        {cta}
                        <Arrow size={13} />
                    </span>
                ) : null}
            </div>
        </Wrapper>
    );
}

export function LeverCard({ levers, delay = 0 }) {
    return (
        <Card span="c2" delay={delay}>
            <p className="label">Leviers SEO</p>
            <ul className="rows">
                {levers.map((lever) => (
                    <li key={lever.label}>
                        <p className="row-k">{lever.label}</p>
                        <p className="row-v">{lever.text}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/**
 * Seuils Core Web Vitals. Ce sont des cibles, jamais des mesures : tant
 * qu'il n'y a pas de relevé réel, afficher un score serait un chiffre inventé.
 */
export function VitalsCard({ vitals, delay = 0 }) {
    return (
        <Card span="c2" delay={delay}>
            <p className="label">Cibles Core Web Vitals</p>
            <ul className="rows vitals">
                {vitals.items.map((item) => (
                    <li key={item.key}>
                        <div>
                            <p className="row-k">{item.key}</p>
                            <p className="row-v">{item.name}</p>
                        </div>
                        <span className="vital-target">{item.target}</span>
                    </li>
                ))}
            </ul>
            <p className="sub" style={{ marginTop: 20 }}>
                {vitals.note}
            </p>
        </Card>
    );
}

export function ProjectCard({ project, delay = 0 }) {
    return (
        <CardLink href={project.url} span="c2" className="proj" delay={delay}>
            <div className="proj-head">
                <p className="proj-domain">{project.domain}</p>
                <span className="tag">{project.sector}</span>
            </div>
            <div className="proj-body">
                <p className="proj-name">{project.name}</p>
                <p className="proj-desc">{project.description}</p>
                <p className="proj-foot">
                    {project.state}
                    <Arrow className="arrow" size={14} />
                </p>
            </div>
        </CardLink>
    );
}

export function SocialCard({ social, delay = 0 }) {
    return (
        <CardLink href={social.url} className="net" delay={delay}>
            <div className="net-top">
                <Brand name={social.icon} />
                <Arrow className="arrow" size={16} />
            </div>
            <p className="handle">{social.handle}</p>
            <p className="sub">{social.note}</p>
        </CardLink>
    );
}

