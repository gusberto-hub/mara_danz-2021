<?php snippet('header') ?>
<?php snippet('navigation') ?>

<header class="header-shop">
    <div class="sub-menu sub-menu-shop">
        <ul>
            <li>
            </li>
            <li class='shop-checkout'>
                <button class="snipcart-checkout">Cart – <span class="snipcart-items-count"></span></button>
            </li>

        </ul>
    </div>
</header>
<div class="main-container" id="product">

    <article>
        <?php $product = $page ?>
        <main class="snipcart-overwrite" role="main">
            <div class="product-details">
                <div class="product-header">
                    <div class="product-name">
                        <?php if($page->item_reloved()->isFalse()): ?>
                        <img src="<?= $site->file('danz_typo.png')->url()?>" alt="">
                        <?php else: ?>
                        <img src="<?= $site->file('reloved_typo.png')->url()?>" alt="">
                        <?php endif ?>
                        <h1 class="title"><?= $product->name() ?></h1>
                    </div>
                    <?php if($product->available()->isTrue()): ?>
                    <p class="price price-desktop">CHF <?= number_format($product->price()->toFloat(),0,"","'")  ?></p>
                    <?php else: ?>
                    <h2 class="title" style="text-transform:uppercase">Sold out</h2>
                    <?php endif ?>

                </div>
                <div class="product-images">

                    <div class="swiper">
                        <!-- <div class="swiper-info">
                            <p>doubleklick to zoom</p>
                        </div> -->
                        <div class="swiper-wrapper">
                            <?php foreach ($product->images()->sortBy('sort') as $image): ?>
                            <div class="swiper-slide">
                                <div class="swiper-zoom-container">
                                    <img class=""
                                        src="<?= $image->thumb(['height'  => 1200, 'quality' => 80,'format' => 'webp'])->url() ?>"
                                        width="500" alt="<?= $image->alt() ?>">
                                </div>
                            </div>
                            <?php endforeach ?>
                        </div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>

                </div>
                <div class="product-description">
                    <div>
                        <p class="price price-mobile">CHF <?= number_format($product->price()->toFloat(),0,"","'")  ?>
                        </p>
                        <ul class="accordion  js-accordion" data-animation="on" data-multi-items="on">

                            <li class="accordion__item accordion__item--is-open ">
                                <div class=" padding-y-sm js-tab-focus" type="button">
                                    <h6 class="">Size</h6>
                                </div>

                                <div class="accordion__panel padding-top-xxs  padding-bottom-md js-accordion__panel">
                                    <div>
                                        <?php $sizes =  $product->sizes()->split();
                            ?>
                                        <?php if (count($sizes) > 1): ?>
                                        <?php foreach ($sizes as $size): ?>
                                        <label class="miro-radiobutton">
                                            <input type="radio" value="<?= $size ?>" name="size">
                                            <span><?= $size ?></span>
                                        </label>
                                        <?php endforeach ?>
                                        <?php else: ?>
                                        <p> <span><?= $product->sizes() ?></span>
                                        </p>
                                        <?php endif ?>
                                    </div>
                                </div>
                            </li>

                            <li class="accordion__item accordion__item--is-open ">
                                <div class=" padding-y-sm js-tab-focus" type="button">
                                    <h6 class="">Description</h6>
                                </div>

                                <div class="accordion__panel padding-top-xxs  padding-bottom-md js-accordion__panel">
                                    <div class="text-component">
                                        <?= $product->description()->kirbytext() ?>
                                    </div>
                                </div>
                            </li>

                            <?php $items = $product->Custom_fields()->toStructure();
foreach ($items as $item): ?>
                            <li class="accordion__item js-accordion__item">
                                <button class="reset accordion__header padding-y-sm js-tab-focus" type="button">
                                    <h6 class=""><?= $item->title() ?></h6>

                                    <svg class="icon accordion__icon-arrow no-js:is-hidden" viewBox="0 0 16 16"
                                        aria-hidden="true">
                                        <g class="icon__group" fill="none" stroke="currentColor" stroke-linecap="square"
                                            stroke-miterlimit="10">
                                            <path d="M2 2l12 12" />
                                            <path d="M14 2L2 14" />
                                        </g>
                                    </svg>
                                </button>

                                <div class="accordion__panel padding-top-xxs  padding-bottom-md js-accordion__panel">
                                    <div>
                                        <?= $item->cf_content()->kirbytext() ?>
                                    </div>
                                </div>
                            </li>
                            <?php endforeach ?>
                            <li class="accordion__item ">
                                <button class="reset accordion__header padding-y-sm js-tab-focus open-terms"
                                    type="button">
                                    <h6 class="">Terms and conditions</h6>
                                </button>
                            </li>
                        </ul>
                    </div>

                    <?php if($product->available()->isTrue()): ?>
                    <button class="add-to-cart-btn snipcart-add-item" data-item-name="<?= $product->name() ?>"
                        data-item-id="<?= $product->Identifier() ?>" data-item-url="<?= $product->url() ?>"
                        data-item-image="<?= $product->image()->url() ?>" data-item-price="<?= $product->price() ?>"
                        data-item-url="<?= $product->url() ?>" data-item-description="<?= $product->description() ?>"
                        data-item-custom1-name="Size"
                        data-item-custom1-options="<?= str_replace(', ','|',$product->sizes())  ?>"
                        data-item-shippable="<?= $product->available() ?>" data-item-custom1-required="true">
                        Add to Cart
                    </button>
                    <?php endif ?>

                </div>
                <div class="terms-conditions text-component">
                    <div class="close-terms"></div>
                    <div class="scroll-container">
                        <?= page('shop')->terms_conditions()->kirbytext() ?>
                    </div>
                </div>
            </div>
        </main>
    </article>
</div>
<script>
const button = document.querySelector('.snipcart-add-item')
let sizes = document.querySelectorAll('input[name="size"]');

for (let i = 0; i < sizes.length; i++) {
    sizes[i].addEventListener("change", () => {
        let val = sizes[i].value;
        button.setAttribute("data-item-custom1-value", val);
    });
}
</script>
<?php snippet('footer') ?>