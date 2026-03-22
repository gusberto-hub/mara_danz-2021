<nav class="navigation">
    <div class="navigation__logo">
        <?php if ($page != 'home' && $page->template() != 'default' && $page->template() != 'world'): ?>
            <a href="<?= $site->url() ?>">
                <?= $site->file('danz_typo.png') ?>
            </a>
        <?php endif ?>
    </div>
    <div class="navigation__menu">
        <ul class="navigation__main-menu">
            <?php foreach ($pages->listed() as $menuItem): ?>
                <li class="navigation__item">
                    <a class="navigation__link <?php e($menuItem->isOpen(), 'is-active') ?>"
                        href="<?= $menuItem->url() ?>"><?= $menuItem->title() ?></a>
                </li>
            <?php endforeach ?>
        </ul>
        <?php if ($page->template() == 'shop' || $page->template() == 'product'): ?>
            <div class="navigation__cart">
                <button class="snipcart-checkout">Cart – <span class="snipcart-items-count"></span></button>
            </div>
        <?php endif ?>
    </div>
</nav>