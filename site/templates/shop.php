<?php snippet('layout', slots: true) ?>
<?php slot() ?>
<div class="shop main-container" id="shop">
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
    <div class="shop__filter">
        <div class="shop__filter-toggle filter-accordion" onclick="document.querySelector('.filter-accordion').classList.toggle('filter-open');">
            <h6>Filter</h6>
        </div>
        <ul class="shop__filter-list">
            <li> <a class="<?php e(!$filterBy, 'is-active') ?>" href="<?= $page->url() ?>">show all</a></li>

            <?php foreach ($filters as $filter) : ?>
                <li>
                    <a class="<?php e($filterBy == $filter, 'is-active') ?>" href="<?= $page->url() ?>?filter=<?= $filter ?>"><?= $filter ?></a>
                </li>
            <?php endforeach ?>

        </ul>

    </div>
    <div class="shop__grid teaser cf">
        <?php foreach ($products as $product) : ?>
            <?php
            $availabilityStatus = trim((string)$product->availability_status()->value());
            if ($availabilityStatus === '') {
                $availabilityStatus = 'available';
            }
            $canAddToCart = $availabilityStatus === 'available';
            ?>
            <a href="<?= $product->url() ?>" class="shop__product">
                <?php if ($product->images()) :
                    $images = $product->images()->sortBy('sort') ?>

                    <div class="shop__product-media">

                        <picture class="shop__product-image shop__product-image--main">
                            <source media="(max-width: 420px)" srcset="<?= $product->primaryimage()->toFile()->thumb($options = ['width' => 300, 'format' => 'webp'])->url() ?>" type="image/webp">
                            <source srcset="<?= $product->primaryimage()->toFile()->thumb($options = ['width' => 550, 'format' => 'webp'])->url() ?>" type="image/webp">
                            <img loading="lazy" width="350" height="525" src="<?= $product->primaryimage()->toFile()->thumb($options = ['width' => 550])->url() ?>" alt="<?= $product->name() ?> main image" />
                        </picture>

                        <?php if ($product->secondaryimage()->isNotEmpty()) : ?>
                            <picture class="shop__product-image shop__product-image--second">
                                <source media="(max-width: 420px)" srcset="<?= $product->secondaryimage()->toFile()->thumb($options = ['width' => 300, 'format' => 'webp'])->url() ?>" type="image/webp">
                                <source srcset="<?= $product->secondaryimage()->toFile()->thumb($options = ['width' => 550, 'format' => 'webp'])->url() ?>" type="image/webp">
                                <img loading="lazy" width="350" height="525" src="<?= $product->secondaryimage()->toFile()->thumb($options = ['width' => 550])->url() ?>" alt="<?= $product->name() ?> secondary image" />
                            </picture>
                        <?php endif ?>
                        <?php if (!$canAddToCart) : ?>
                            <div class="shop__product-badge">
                                <p><?= $availabilityStatus ?></p>
                            </div>
                        <?php endif ?>
                    </div>

                <?php endif ?>

                <div class="shop__product-body">
                    <h2 class="shop__product-title"><?= $product->name()->html() ?></h2>
                    <?php if ($canAddToCart) : ?>
                        <p class="shop__product-price">CHF <?= number_format($product->price()->toFloat(), 0, "", "'")  ?></p>
                    <?php endif ?>
                </div>

            </a>
            <div hidden>
                <?php $sizes =  $product->sizes()->split();
                ?>
                <button class="shop__product-add-btn snipcart-add-item" data-item-name="<?= $product->name() ?>" data-item-id="<?= $product->Identifier() ?>" data-item-url="<?= $product->url() ?>" data-item-image="<?= $product->image()->url() ?>" data-item-price="<?= $product->price() ?>" data-item-url="<?= $product->url() ?>" data-item-description="<?= $product->description() ?>" data-item-custom1-name="Size" data-item-custom1-options="<?php foreach ($sizes as $size) : ?><?= $size ?>|<?php endforeach ?>" data-item-shippable="<?= $canAddToCart ? 'true' : 'false' ?>" data-item-custom1-required="true">
                    Add to Cart
                </button>
            </div>
        <?php endforeach ?>
    </div>
</div>
<cart isSideCart="true" editingCart="true"> </cart>

<?php endslot() ?>
<?php endsnippet() ?>
