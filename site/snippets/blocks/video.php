<?php

/** @var \Kirby\Cms\Block $block */ ?>
<?php if ($block->url()->isNotEmpty()) : ?>
  <!-- <div class="campaign-video"> -->
    <figure class="campaign-video">
        <?= video($block->url(), [
          'vimeo' => [
            'autoplay' => 0,
            'controls' => 0,
            'mute'     => 0,
            'title'    => 0,
            'byline'   => 0,
            'portrait' => 0,
            'dnt'      => 1
          ],
          'youtube' => [
            'autoplay' => 0,
            'controls' => 0,
            'mute'     => 0,
            'disablekb' => 1,
            'iv_load_policy' => 3,
            'rel' => 0,
            'playsinline' => 1,
            'fs' => 1,
            'hl' => 'en',
          ],
        ]) ?>
        <?php if ($block->caption()->isNotEmpty()) : ?>
          <figcaption><?= $block->caption() ?></figcaption>
        <?php endif ?>
    </figure>
  <!-- </div> -->
<?php endif ?>