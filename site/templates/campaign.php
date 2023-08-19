<?php
$collection = $page->parent();
snippet('header');
snippet('navigation');
snippet('sub_nav_collection', ['collection' => $collection]);
?>

<div class="main-container" id="campaign">
    <article>
        <div class="page-title">
            <h1><?= $collection->name() ?></h1>
            <p class="year"><?= $collection->year() ?></p>
        </div>

        <div class="image-container">
            <?php foreach ($page->layout()->toBlocks() as $block) :
            ?>
                <?= $block ?>
            <?php endforeach ?>
        </div>
    </article>
</div>


<?php snippet('footer') ?>