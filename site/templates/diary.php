<?php snippet('header') ?>
<?php snippet('navigation') ?>

<header>
    <?php $children = $page->children()->listed()?>
    <div class="sub-menu">
        <ul>
            <?php foreach ($children as $child): ?>
            <li><a href="#<?= $child->title() ?>" class="js-smooth-scroll"><?= $child->title() ?></a></li>
            <?php endforeach ?>
        </ul>
    </div>
</header>

<div class="main-container" id="diary">

    <?php foreach ($children as $child): ?>
    <article id="<?= $child->title() ?>">
        <?php foreach ($child->layout()->toLayouts() as $layout): ?>
        <div class="collab" id="<?= $layout->id() ?>">
            <?php foreach ($layout->columns() as $column): ?>
            <div class="column" style="--span:<?= $column->span() ?>">
                <div class="blocks">
                    <?= $column->blocks() ?>
                </div>
            </div>
            <?php endforeach ?>
        </div>
        <?php endforeach ?>

    </article>
    <?php endforeach ?>
</div>


<?php snippet('footer') ?>