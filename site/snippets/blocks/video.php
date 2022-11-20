<?php /** @var \Kirby\Cms\Block $block */ ?>
<?php if ($block->url()->isNotEmpty()): ?>
<div class="block">
    <div class="campaign-video width-100%">
        <figure class="aspect-ratio-16:9">
            <?= video($block->url(),[
          'vimeo' => [
            'autoplay' => 0,
            'controls' => 0,
            'mute'     => 0
          ],
          'youtube' => [
            'autoplay' => 0,
            'controls' => 2,
            'mute'     => 1,
            'color' => 'white',
            'iv_load_policy' => 3,
            'modestbranding' => 1,
            'rel' => 0,
            'showinfo' => 0,
          ],]) ?>
            <?php if ($block->caption()->isNotEmpty()): ?>
            <figcaption><?= $block->caption() ?></figcaption>
            <?php endif ?>
        </figure>
    </div>
</div>
<?php endif ?>