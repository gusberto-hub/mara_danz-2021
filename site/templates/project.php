<?php snippet('layout', slots: true) ?>
<?php slot() ?>
<?php
$projects = $page->siblings()
    ->listed()
    ->filterBy('intendedTemplate', 'project')
    ->sortBy('num', 'asc');
$currentIndex = $projects->indexOf($page);
$prevProject = $currentIndex !== false && $currentIndex > 0 ? $projects->nth($currentIndex - 1) : null;
$nextProject = $currentIndex !== false && $currentIndex < $projects->count() - 1 ? $projects->nth($currentIndex + 1) : null;
?>

<div class="main-container project">
    <?php foreach ($page->layout()->toLayouts() as $layout) : ?>
        <div class="collab" id="<?= $layout->id() ?>">
            <?php foreach ($layout->columns() as $column) : ?>
                <div class="column" style="--span:<?= $column->span() ?>">
                    <div class="blocks">
                        <?= $column->blocks() ?>
                    </div>
                </div>
            <?php endforeach ?>
        </div>
    <?php endforeach ?>

    <?php if ($prevProject || $nextProject) : ?>
        <nav class="project-nav" aria-label="Project navigation">
            <div class="project-nav__item project-nav__item--prev">
                <?php if ($prevProject) : ?>
                    <a href="<?= $prevProject->url() ?>" rel="prev">
                        <span class="project-nav__label">Prev</span>
                        <span class="project-nav__title"><?= $prevProject->projecttitle()->or($prevProject->title()) ?></span>
                    </a>
                <?php endif ?>
            </div>
            <div class="project-nav__item project-nav__item--next">
                <?php if ($nextProject) : ?>
                    <a href="<?= $nextProject->url() ?>" rel="next">
                        <span class="project-nav__label">Next</span>
                        <span class="project-nav__title"><?= $nextProject->projecttitle()->or($nextProject->title()) ?></span>
                    </a>
                <?php endif ?>
            </div>
        </nav>
    <?php endif ?>
</div>

<?php endslot() ?>
<?php endsnippet() ?>