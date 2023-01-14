<div class="main-container">

    <div class="project-grid">

        <?php foreach($page->children()->listed() as $project): ?>

        <a href="<?= $project->url() ?>" class="project">
            <div class="thumbnail">
                <?= $project->image()->thumb(['width' => 500]) ?>
            </div>
            <div class="description vcr-font">
                <p>
                    <?= $project->projecttitle() ?>,
                    <?= $project->subtitle() ?>
                    <?= $project->location() ?>
                    <?= $project->year() ?>
                </p>
            </div>
        </a>

        <?php endforeach ?>


    </div>

</div>