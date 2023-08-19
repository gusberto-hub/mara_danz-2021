<?php
$collection = $page->parent();
snippet('header');
snippet('navigation');
snippet('sub_nav_collection', ['collection' => $collection]);
?>

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
                <?php foreach ($images as $image) : ?>
                    <div class='image-collection'>
                        <picture>
                            <source srcset="<?= $image->thumb($options = ['width' => 400, 'format' => 'webp'])->url() ?>" type="image/webp">
                            <img srcset="<?= $image->thumb($options = ['width' => 300])->url() ?>" alt="" loading="lazy">
                        </picture>
                    </div>
                <?php endforeach ?>
            </div>
        </div>
        <div class="fullscreen-carousel">
            <div class="close-window-icon" id="close-fullscreen"></div>
            <?php foreach ($images as $image) : ?>
                <div class='carousel-cell'>
                    <picture>
                        <source srcset="<?= $image->thumb($options = ['width' => 1000, 'format' => 'webp'])->url() ?>" type="image/webp">
                        <img src="<?= $image->thumb($options = ['width' => 1000])->url() ?>" alt="lookbook picture <?= $image->indexOf() . ' ' . $collection->name()  ?>" loading="lazy" width="300" height="500">
                    </picture>
                </div>
                <?= $image->count() ?>
            <?php endforeach ?>
        </div>
    </article>
</main>


<?php snippet('footer') ?>