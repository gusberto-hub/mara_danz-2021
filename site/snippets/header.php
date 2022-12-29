<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="<?= $site->metaDescription() ?>">
    <!-- Für Apple-Geräte -->
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon-180x180.png">
    <!-- Für Browser -->
    <link rel="shortcut icon" type="image/x-icon" href="/favicon/favicon-32x32.ico">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
    <!-- Für Windows Metro -->
    <meta name="msapplication-square310x310logo" content="/favicon/mstile-310x310.png">
    <meta name="msapplication-TileColor" content="[HEXFARBE (z.B. #000000)]">
    <meta name="facebook-domain-verification" content="xs4wurd5wqz7d32tzrlsaxwm07205s" />
    <script>
    document.documentElement.className = "js";
    var supportsCssVars = function() {
        var e,
            t = document.createElement("style");
        return (
            (t.innerHTML = "root: { --tmp-var: bold; }"),
            document.head.appendChild(t),
            (e = !!(
                window.CSS &&
                window.CSS.supports &&
                window.CSS.supports("font-weight", "var(--tmp-var)")
            )),
            t.parentNode.removeChild(t),
            e
        );
    };
    supportsCssVars() ||
        alert(
            "Please view this demo in a modern browser that supports CSS Variables."
        );
    </script>
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '639324087794593'); 
    fbq('track', 'PageView');
    </script>
    <noscript>
        <img height="1" width="1" src="https://www.facebook.com/tr?id=639324087794593&ev=PageView&noscript=1"/>
    </noscript>
    <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css" />
    <?= Bnomei\Fingerprint::css('assets/css/style.css');?>
    <title><?= $site->title()?>
        <?php if ($page->parent() == 'shop'): ?>
        | Shop – <?= $page->title() ?>
        <?php elseif ($page != 'home'): ?>
        | <?= $page->title() ?>
        <?php else:  ?>
        | Fashion Design
        <?php  endif ?>
    </title>
</head>

<body>