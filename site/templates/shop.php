<?php snippet('header') ?>
<?php snippet('navigation') ?>
<header class="header-shop">
    <div class="sub-menu sub-menu-shop">
        <ul>
            <li>
                <?php
                $filterBy = get('filter');
                $unfiltered = $page
                    ->children()
                    ->listed();

                $products = $unfiltered
                    ->when($filterBy, function ($filterBy) {
                        return $this->filterBy('category', $filterBy);
                    });

                $filters = $unfiltered->pluck('category', null, true);
                ?>
                <div class="product-filter">
                    <div class="filter-accordion" onclick="document.querySelector('.filter-accordion').classList.toggle('filter-open');">
                        <h6>Filter</h6>
                    </div>
                    <ul>
                        <li> <a class="<?php e(!$filterBy, 'is-active') ?>" href="<?= $page->url() ?>">show all</a></li>

                        <?php foreach ($filters as $filter) : ?>
                            <li>
                                <a class="<?php e($filterBy == $filter, 'is-active') ?>" href="<?= $page->url() ?>?filter=<?= $filter ?>"><?= $filter ?></a>
                            </li>
                        <?php endforeach ?>
                    </ul>

                </div>
            </li>
            <li class='shop-checkout'>
                <button class="snipcart-checkout">Cart – <span class="snipcart-items-count"></span></button>
            </li>

        </ul>
    </div>
</header>
<div class="main-container" id="shop">
    <article>
        <div class="teaser cf products-grid">
            <?php foreach ($products as $product) : ?>
                <a href="<?= $product->url() ?>" class="product">
                    <?php if ($product->images()) :
                        $images = $product->images()->sortBy('sort') ?>

                        <div class='product-image'>
                            <img class='main-image' width="600" src="<?= $product->primaryimage()->toFile()->thumb($options = ['width' => 600])->url() ?>" />

                            <?php if ($product->secondaryimage()->isNotEmpty()) : ?>
                                <img class='second-image' width="600" src="<?= $product->secondaryimage()->toFile()->thumb($options = ['width' => 600])->url() ?>" />
                            <?php endif ?>
                            <?php if ($product->availability_status() == 'sold out') : ?>
                                <div class="product-not-available">
                                    <p>sold out</p>
                                </div>
                            <?php endif ?>
                            <?php if ($product->availability_status() == 'coming soon') : ?>
                                <div class="product-not-available">
                                    <p>coming soon</p>
                                </div>
                            <?php endif ?>
                        </div>

                    <?php endif ?>

                    <div class="product-info">
                        <h2 class="product-name"><?= $product->name()->html() ?></h2>
                        <?php if ($product->availability_status() != 'coming soon') : ?>
                            <p class="product-price">CHF <?= number_format($product->price()->toFloat(), 0, "", "'")  ?></p>
                        <?php endif ?>
                    </div>

                </a>
                <div hidden>
                    <?php $sizes =  $product->sizes()->split();
                    ?>
                    <button class="snipcart-add-item" data-item-name="<?= $product->name() ?>" data-item-id="<?= $product->Identifier() ?>" data-item-url="<?= $product->url() ?>" data-item-image="<?= $product->image()->url() ?>" data-item-price="<?= $product->price() ?>" data-item-url="<?= $product->url() ?>" data-item-description="<?= $product->description() ?>" data-item-custom1-name="Size" data-item-custom1-options="<?php foreach ($sizes as $size) : ?><?= $size ?>|<?php endforeach ?>" data-item-shippable="<?= $product->available() ?>" data-item-custom1-required="true">
                        Add to Cart
                    </button>
                </div>
            <?php endforeach ?>
        </div>
    </article>
</div>
<cart isSideCart="true" editingCart="true"> </cart>

<?php snippet('footer') ?>