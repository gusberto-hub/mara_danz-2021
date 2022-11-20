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
    document.getElementsByTagName("html")[0].className += " js";
    </script>
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