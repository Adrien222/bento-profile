import MailButton from './MailButton';
import Reveal from './Reveal';

/**
 * Une ligne de titre qui monte depuis sa propre fenêtre masquée.
 */
function MaskedLine({ className = '', delay, children }) {
    return (
        <span className={`mask ${className}`.trim()} style={{ '--d': `${delay}s` }}>
            <span>{children}</span>
        </span>
    );
}

/**
 * Le gras de la bio est écrit en Markdown léger dans la config : `**mot**`.
 */
function renderBio(bio) {
    return bio.split(/(\*\*[^*]+\*\*)/).map((chunk, i) =>
        chunk.startsWith('**') && chunk.endsWith('**') ? <b key={i}>{chunk.slice(2, -2)}</b> : chunk,
    );
}

export default function Hero({ profile }) {
    return (
        <header className="hero">
            <p className="label mask" style={{ '--d': '.05s' }}>
                <span>
                    Je suis {profile.name}, {profile.age} ans
                </span>
            </p>

            <h1>
                {profile.headline.map((line, i) => (
                    <MaskedLine
                        key={line.text}
                        delay={0.16 + i * 0.1}
                        className={[line.offset ? 'l-offset' : '', line.align === 'right' ? 'l-right' : '']
                            .filter(Boolean)
                            .join(' ')}
                    >
                        {line.amp ? <span className="amp">{line.text}</span> : line.text}
                    </MaskedLine>
                ))}
            </h1>

            <Reveal className="hero-foot" delay={0.7}>
                <p className="hero-bio">{renderBio(profile.bio)}</p>
                <MailButton email={profile.email} />
            </Reveal>
        </header>
    );
}
