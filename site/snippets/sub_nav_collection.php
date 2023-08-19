<header>
    <div class="sub-menu">
        <ul>
            <li><a href="<?= $page->parent()->parent()->url() ?>"><?= $collection->year() ?></a>
            </li>
            <?php foreach ($page->siblings() as $sibling) : ?>
                <li>
                    <a href="<?= $sibling->url() ?>" class="<?php e($sibling->isOpen(), 'is-active') ?>"><?= $sibling->title() ?></a>
                </li>
            <?php endforeach ?>
        </ul>
    </div>
</header>