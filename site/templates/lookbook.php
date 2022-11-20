<?php snippet('header') ?>
<?php snippet('navigation') ?>
<header>
    <?php $collection = $page->parent()?>
    <div class="sub-menu">
        <ul>
            <li><a href="<?= $page->parent()->parent()->url() ?>"><?= $collection->year() ?></a>
            </li>
            <li class="is-active"><a href="<?= $page->parent()->parent()->url() ?>"></a><?= $page->title() ?>
            </li>
            <li>|</li>
            <?php foreach ($page->siblings($self = false) as $sibling): ?>
            <li>
                <a href="<?= $sibling->url() ?>"><?= $sibling->title() ?></a>
            </li>
            <?php endforeach ?>
        </ul>
    </div>
</header>

<main class="main-container" id="lookbook">
    <article>
        <div class="page-title">
            <h1><?= $collection->name() ?></h1>
            <p class="year"><?= $collection->year() ?></p>
        </div>

        <div class="text-layer">
            <div class="page-description">
                <?= $page->collaborators()->kirbytext() ?>
            </div>
        </div>

        <div class="image-layer">
            <div class="image-container">
                <?php $images = $page->images()->sortBy('sort') ?>
                <?php foreach ($images as $image): ?>
                <div class='image-collection'>
                    <picture>
                        <img src="<?= $image->resize(500)->url() ?>" alt="">
                    </picture>
                </div>
                <?php endforeach ?>
            </div>
        </div>
        <div class="fullscreen-carousel">
            <div class="close-fullscreen"></div>
            <?php foreach ($images as $image): ?>
            <div class='carousel-cell'>
                <picture>
                    <img src="<?= $image->resize(800)->url() ?>" alt="">
                </picture>
            </div>
            <?= $image->count() ?>
            <?php endforeach ?>
        </div>
    </article>
    </ma>


    <?php snippet('footer') ?>