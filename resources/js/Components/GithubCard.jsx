import { useMemo } from 'react';
import Card from './Card';
import { Arrow } from './Icons';

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

const LEVELS = [0, 1, 2, 3, 4];

function frenchDate(iso) {
    const [year, month, day] = iso.split('-');

    return `${Number(day)} ${MOIS[Number(month) - 1]} ${year}`;
}

function tooltip(day) {
    const count = day.count === 0 ? 'Aucune contribution' : `${day.count} contribution${day.count > 1 ? 's' : ''}`;

    return `${count} le ${frenchDate(day.date)}`;
}

/**
 * Une étiquette de mois par colonne qui change de mois.
 */
function monthLabels(days) {
    const labels = [];
    let last = null;

    for (let i = 0; i < days.length; i += 7) {
        const month = Number(days[i].date.split('-')[1]) - 1;

        if (month !== last) {
            labels.push({ column: i / 7 + 1, text: MOIS[month] });
            last = month;
        }
    }

    return labels;
}

/**
 * Carte de contributions GitHub.
 *
 * `github` est null quand l'endpoint n'a pas répondu : la carte se réduit
 * alors au lien vers le profil, sans grille ni chiffres inventés.
 */
export default function GithubCard({ login, name, avatar, github, delay = 0 }) {
    const months = useMemo(() => (github ? monthLabels(github.days) : []), [github]);

    return (
        <Card span="c4" className="gh" delay={delay}>
            <div className="gh-head">
                <img className="gh-avatar" src={avatar} alt="" width="400" height="400" />
                <div className="gh-id">
                    <p className="gh-name">{name}</p>
                    <p className="sub">@{login} sur GitHub</p>
                </div>
                <a
                    className="gh-follow"
                    href={`https://github.com/${login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Follow
                    <Arrow size={12} />
                </a>
            </div>

            {github ? (
                <>
                    <div className="gh-scroll">
                        <div className="gh-plot">
                            <div className="gh-months">
                                {months.map((label) => (
                                    <span key={label.column} style={{ gridColumn: label.column }}>
                                        {label.text}
                                    </span>
                                ))}
                            </div>
                            <div className="gh-body">
                                <div className="gh-days">
                                    <span>Lun</span>
                                    <span>Mer</span>
                                    <span>Ven</span>
                                </div>
                                <div
                                    className="gh-grid"
                                    role="img"
                                    aria-label={`${github.total} contributions entre le ${frenchDate(github.start)} et le ${frenchDate(github.end)}`}
                                >
                                    {github.days.map((day) => (
                                        <span
                                            key={day.date}
                                            className="gh-cell"
                                            data-l={day.level}
                                            title={tooltip(day)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gh-foot">
                        <p className="gh-stat">
                            <b>{github.total}</b> contributions sur douze mois
                        </p>
                        {github.repos !== null ? (
                            <p className="gh-stat">
                                <b>{github.repos}</b> dépôts publics
                            </p>
                        ) : null}
                        {github.followers !== null ? (
                            <p className="gh-stat">
                                <b>{github.followers}</b> abonnés
                            </p>
                        ) : null}
                        <div className="gh-legend">
                            Moins
                            {LEVELS.map((level) => (
                                <i key={level} style={{ background: `var(--color-h${level})` }} />
                            ))}
                            Plus
                        </div>
                    </div>
                </>
            ) : (
                <div className="gh-skeleton">
                    <p className="sub">Calendrier indisponible pour le moment.</p>
                </div>
            )}
        </Card>
    );
}
