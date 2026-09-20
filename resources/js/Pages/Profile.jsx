import { Head } from '@inertiajs/react';
import Card from '../Components/Card';
import LinkButton from '../Components/LinkButton';

const ACCENTS = {
    neutral: 'bg-neutral-900 text-white dark:bg-neutral-700',
    blue: 'bg-blue-600 text-white',
    red: 'bg-red-600 text-white',
};

function Avatar({ name, src }) {
    if (src) {
        return <img src={src} alt="" className="size-20 rounded-full object-cover" />;
    }

    // Repli sur l'initiale tant qu'aucune image n'est fournie.
    return (
        <div className="flex size-20 items-center justify-center rounded-full bg-neutral-200 text-2xl font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {name.charAt(0)}
        </div>
    );
}

function SocialCard({ social }) {
    return (
        <Card className="flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
                <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        ACCENTS[social.accent] ?? ACCENTS.neutral
                    }`}
                >
                    {social.label.charAt(0)}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{social.label}</p>
                    <p className="truncate text-xs text-neutral-500">{social.handle}</p>
                </div>
            </div>
            <LinkButton href={social.url}>{social.cta}</LinkButton>
        </Card>
    );
}

function ProjectCard({ project }) {
    return (
        <Card span="md:col-span-2" className="flex flex-col gap-4">
            <span className="w-fit rounded-md bg-orange-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                {project.tag}
            </span>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-xs text-neutral-500">{project.domain}</p>
                </div>
                <LinkButton href={project.url}>{project.cta}</LinkButton>
            </div>

            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {project.description}
            </p>
        </Card>
    );
}

export default function Profile({ profile }) {
    return (
        <>
            <Head title={profile.name} />

            <main className="mx-auto max-w-5xl px-4 py-10">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Carte identité : occupe toute la hauteur sur grand écran. */}
                    <Card span="md:col-span-2 md:row-span-2" className="flex flex-col gap-5">
                        <Avatar name={profile.name} src={profile.avatar} />

                        <div>
                            <h1 className="text-2xl font-bold">{profile.name}</h1>
                            <p className="text-sm text-neutral-500">{profile.headline}</p>
                        </div>

                        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {profile.bio}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {[profile.location, profile.headline].filter(Boolean).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto border-t border-neutral-200 pt-4 dark:border-neutral-800">
                            <a
                                href={`mailto:${profile.email}`}
                                className="text-sm text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-400"
                            >
                                {profile.email}
                            </a>
                        </div>
                    </Card>

                    {profile.socials.map((social) => (
                        <SocialCard key={social.label} social={social} />
                    ))}

                    {profile.projects.map((project) => (
                        <ProjectCard key={project.name} project={project} />
                    ))}
                </div>
            </main>
        </>
    );
}
