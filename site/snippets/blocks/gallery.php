<?php

/** @var \Kirby\Cms\Block $block */ ?>

<div class="gallery-block block">
    <?php foreach ($block->images()->toFiles() as $image) : ?>

        <picture>
            <source media="(max-width: 420px)" srcset="<?= $image->thumb(['width' => 400, 'format' => 'webp'])->url() ?>" />
            <source srcset="<?= $image->thumb(['width' => 2200, 'format' => 'webp'])->url() ?>" type="image/webp" />
            <img src="<?= $image->thumb(['width' => 1800])->url() ?>" alt="<?= $image->alt() ?>" loading="lazy" class="<?= e($image->fullscreen()->isTrue(), 'fullscreen', '') ?>" width="400" height="600" />
        </picture>
    <?php endforeach ?>
</div>