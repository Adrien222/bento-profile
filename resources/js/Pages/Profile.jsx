import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    ClockCard,
    LeverCard,
    LocationCard,
    Panel,
    PhotoCard,
    ProjectCard,
    SlotCard,
    SocialCard,
    StatusCard,
    VitalsCard,
} from '../Components/Cards';
import { Arcs, Marquee, SectionTitle, SideTab, ThemeToggle } from '../Components/Chrome';
import GithubCard from '../Components/GithubCard';
import Hero from '../Components/Hero';

export default function Profile({ profile, github }) {
    // Déclenche la montée des lignes du hero une fois la page peinte.
    useEffect(() => {
        const id = requestAnimationFrame(() => document.documentElement.classList.add('loaded'));

        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <>
            <Head title={profile.seo.title} />

            <Arcs />
            <SideTab status={profile.status} email={profile.email} />

            <div className="wrap">
                <div className="topbar">
                    <span>
                        <b>{profile.name}</b> <span className="sep">/</span> profil
                    </span>
                    <ThemeToggle />
                </div>

                <Hero profile={profile} />

                <Marquee items={profile.marquee} />

                {/* repères, puis l'agence directement en dessous */}
                <section className="sec" style={{ marginTop: 56 }}>
                    <div className="bento">
                        <PhotoCard src={profile.avatar} alt={`Portrait d'${profile.name}`} />
                        <StatusCard status={profile.status} delay={0.08} />
                        <ClockCard timezone={profile.timezone} delay={0.16} />
                        <LocationCard location={profile.location} note={profile.location_note} delay={0.24} />

                        <Panel
                            tone="plain"
                            href={profile.agency.url}
                            eyebrow={profile.agency.eyebrow}
                            title={profile.agency.name}
                            description={profile.agency.description}
                            stats={profile.agency.stats}
                            cta={profile.agency.cta}
                            delay={0.32}
                        />
                    </div>
                </section>

                <section className="sec">
                    <SectionTitle eyebrow={profile.expertise.eyebrow} title={profile.expertise.title} />
                    <div className="bento">
                        <Panel
                            tone="cobalt"
                            eyebrow={profile.expertise.panel_eyebrow}
                            title={profile.expertise.panel_title}
                            description={profile.expertise.panel_description}
                            stats={profile.expertise.stats}
                        />
                        <LeverCard levers={profile.levers} delay={0.1} />
                        <VitalsCard vitals={profile.vitals} delay={0.18} />
                    </div>
                </section>

                <section className="sec">
                    <SectionTitle eyebrow="Historique" title="Projets" count={profile.projects.length} />
                    <div className="bento">
                        {profile.projects.map((project, i) => (
                            <ProjectCard key={project.domain} project={project} delay={(i % 2) * 0.1} />
                        ))}
                        <SlotCard delay={0.1}>
                            Prochain projet : la grille en absorbe un de plus sans retouche
                        </SlotCard>
                    </div>
                </section>

                <section className="sec">
                    <SectionTitle eyebrow="Me suivre" title="Réseaux" />
                    <div className="bento">
                        {profile.socials.map((social, i) => (
                            <SocialCard key={social.label} social={social} delay={i * 0.08} />
                        ))}
                        <GithubCard
                            login={profile.github.login}
                            name={profile.name}
                            avatar={profile.avatar}
                            github={github}
                            delay={0.16}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
