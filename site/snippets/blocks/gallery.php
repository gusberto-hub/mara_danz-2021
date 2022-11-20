<?php /** @var \Kirby\Cms\Block $block */ ?>

<div class="gallery-block block">
    <?php foreach ($block->images()->toFiles() as $image): ?>

    <picture>
        <!-- <source media="(max-width: 420px)" srcset="
    <?= $image->thumb(['width' => 1000])->url() ?>" data-flickity-lazyload-srcset="
    <?= $image->thumb(['width' => 1000])->url() ?>">
        <source media="(min-width: 421px)" srcset="
    <?= $image->thumb(['width' => 2200])->url() ?>" data-flickity-lazyload-srcset="
    <?= $image->thumb(['width' => 2200])->url() ?>"> -->
        <img src="<?= $image->thumb(['width' => 2200])->url() ?>" alt="<?= $image->alt() ?>" loading="lazy"
            class="<?= e($image->fullscreen()->isTrue(), 'fullscreen', '') ?>" />
    </picture>
    <?php endforeach ?>
</div>