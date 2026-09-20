@php
    $seo = config('profile.seo');

    // Construit ici plutôt que dans @json(...) : Blade ne sait pas parser un
    // tableau multiligne à l'intérieur d'une directive.
    $jsonLd = [
        '@context' => 'https://schema.org',
        '@type' => 'Person',
        'name' => config('profile.name'),
        'email' => 'mailto:'.config('profile.email'),
        'image' => url(config('profile.avatar')),
        'jobTitle' => 'Développeur full-stack & expert SEO',
        'url' => url('/'),
        'sameAs' => array_column(config('profile.socials'), 'url'),
        'worksFor' => [
            '@type' => 'Organization',
            'name' => config('profile.agency.name'),
            'url' => config('profile.agency.url'),
        ],
    ];
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Servi côté serveur : la page reste indexable sans exécution JavaScript. --}}
    <title inertia>{{ $seo['title'] }}</title>
    <meta name="description" content="{{ $seo['description'] }}">
    <link rel="canonical" href="{{ url()->current() }}">

    <meta property="og:type" content="profile">
    <meta property="og:title" content="{{ $seo['title'] }}">
    <meta property="og:description" content="{{ $seo['description'] }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ url($seo['image']) }}">
    <meta name="twitter:card" content="summary_large_image">

    <script type="application/ld+json">
        {!! json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    </script>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
