<?php snippet('header') ?>
<?php snippet('navigation') ?>

<header>
    <div class="sub-menu">
        <ul>
            <li><a href="#<?= $page->headline1() ?>" class=" js-smooth-scroll"><?= $page->headline1() ?></a>
            </li>
            <li><a href="#<?= $page->headline2() ?>" class=" js-smooth-scroll"><?= $page->headline2() ?></a>
            </li>
        </ul>
    </div>
</header>
<div class="main-container" id="world">
    <section>
        <article id="<?= $page->headline1() ?>">
            <div class="headline">
                <?= $site->file('danz_typo.svg') ?>
            </div>
            <div class="paragraph">
                <?= $page->paragraph1()->kirbytext() ?>
                <div class="info-button">
                    <button>
                        Contact
                    </button>
                </div>
            </div>
            <div class="static-image">
                <?= $page->Picture_static_1()->toFile() ?>
            </div>
            <div class="flow-image">
                <?= $page->Picture_flow_1()->toFile() ?>
            </div>
        </article>

        <article id="<?= $page->headline2() ?>">
            <div class="headline">
                <?= $site->file('reloved_typo.svg') ?>
            </div>
            <div class="paragraph">
                <?= $page->paragraph2()->kirbytext() ?>
            </div>
            <div class="static-image">
                <?= $page->Picture_static_2()->toFile() ?>
            </div>
            <div class="flow-image reloved">
                <?= $page->Picture_flow_2()->toFile() ?>
            </div>
        </article>
    </section>
</div>


<?php snippet('footer') ?>