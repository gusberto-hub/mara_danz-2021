<?php snippet('header') ?>
<?php snippet('navigation') ?>

<?= $slot ?>

<?php if ($page != 'home'): ?>
    <?php snippet('info_box') ?>
<?php endif ?>

<?php snippet('htmlEnd') ?>
