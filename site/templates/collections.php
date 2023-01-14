<?php snippet('header') ?>
<?php snippet('navigation') ?>
<header>
    <div class="sub-menu">
        <ul>
            <?php foreach ($page->children()->listed() as $collection) : ?>
                <li><a href="#<?= $collection->year() ?>" class="js-smooth-scroll"><?= $collection->year() ?></a></li>
            <?php endforeach ?>
        </ul>
    </div>
</header>

<main class="main-container" id="collections">
    <?php foreach ($page->children()->listed() as $collection) : ?>
        <article id="<?= $collection->year() ?>">
            <div class="page-title">
                <h2><?= $collection->name() ?></h2>
                <p class="year">ss21</p>
                <ul>
                    <?php foreach ($collection->children()->listed() as $child) : ?>
                        <li><a href="<?= $child->url() ?>"><?= $child->title() ?></a></li>
                    <?php endforeach ?>
                </ul>
            </div>

            <div class="text-layer">
                <div class="page-description">
                    <?= $collection->description()->kirbytext() ?>
                </div>
            </div>

            <div class="image-container">
                <div class="image-slider">
                    <?php foreach ($collection->images() as $image) : ?>
                        <div class='image-collection'>
                            <picture>
                                <img src="<?= $image->url() ?>" alt="" width="<?= $image->width() ?>" height="<?= $image->height() ?>">
                            </picture>
                        </div>
                    <?php endforeach ?>
                </div>
                <div class="swiper-collection">
                    <div class="swiper-wrapper">
                        <?php foreach ($collection->images()->sortBy('sort') as $image) : ?>
                            <div class="swiper-slide">
                                <img class="" src="<?= $image->thumb(['height'  => 1200, 'quality' => 80, 'format' => 'webp'])->url() ?>" width="500" alt="<?= $image->alt() ?>">
                            </div>
                        <?php endforeach ?>
                    </div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                </div>
            </div>

        </article>
    <?php endforeach ?>

</main>

<?php snippet('footer') ?>