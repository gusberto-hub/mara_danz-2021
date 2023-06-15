<?php snippet('header') ?>
<?php snippet('navigation') ?>
<header>
    <?php $collection = $page->parent() ?>
    <div class="sub-menu">
        <ul>
            <li><a href="<?= $page->parent()->parent()->url() ?>"><?= $collection->year() ?></a>
            </li>
            <li class="is-active"><a href="<?= $page->parent()->parent()->url() ?>"></a><?= $page->title() ?>
            </li>
            <li>|</li>
            <?php foreach ($page->siblings($self = false) as $sibling) : ?>
                <li>
                    <a href="<?= $sibling->url() ?>"><?= $sibling->title() ?></a>
                </li>
            <?php endforeach ?>
        </ul>
    </div>
</header>


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