<?php snippet('header') ?>
<?php snippet('navigation') ?>

<div id="main-container">
    <div class="content-container">

        <section class="sub-menu">
            <ul>
                <?php foreach($page->children()->listed() as $submenu): ?>
                <li>
                    <a href="#<?= $submenu->title() ?>"><?= $submenu->title() ?></a>
                </li>
                <?php  endforeach ?>
            </ul>
        </section>


        <?php foreach($page->children()->listed() as $collection): ?>
        <section id="<?= $collection->title() ?>" class='collection'>
            <div class="collections-container">
                <div class="title">
                    <p><?= $collection->year() ?></p>
                    <h2><?= $collection->name() ?></h2>
                </div>
                <div class="images">
                    <div class="subtitle">
                        <?php foreach($collection->children()->listed() as $subitem): ?>
                        <a href="<?= $subitem->url() ?>"><?= $subitem->title() ?></a>

                        <?php  endforeach ?>
                    </div>
                    <div class="main-carousel">

                        <?php foreach($collection->images()->sortBy('sort') as $image): ?>

                        <div class="carousel-cell">
                            <picture>
                                <img src="<?= $image->thumb(['width' => 2200])->url() ?>" width="<?= $image->width() ?>"
                                    height="<?= $image->height() ?>" alt="<?= $image->alt() ?>" loading="lazy" />
                            </picture>
                        </div>
                        <?php  endforeach ?>
                    </div>
                </div>
            </div>
        </section>
        <?php  endforeach ?>


    </div>



</div>


<?php snippet('footer') ?>