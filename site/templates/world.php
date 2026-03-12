<?php snippet('layout', slots: true) ?>
<?php slot() ?>

<div class="main-container world-page">
    <section class="world-page__section">
        <div class="world-page__headline">
            <?= $site->file('danz_typo.png') ?>
        </div>
        <div class="world-page__paragraph">
            <?= $page->paragraph1()->kirbytext() ?>
            <div class="info-box__button">
                <button>
                    Contact
                </button>
            </div>
        </div>
        <div class="world-page__static-image">
            <?= $page->Picture_static_1()->toFile() ?>
        </div>
        <div class="world-page__flow-image">
            <?= $page->Picture_flow_1()->toFile() ?>
        </div>
    </section>
</div>


<?php endslot() ?>
<?php endsnippet() ?>