<?php snippet('layout', slots: true) ?>
<?php slot() ?>

<main class="main-container design-system">
    <header class="design-system__header">
        <p class="design-system__eyebrow">Reference</p>
        <h1 class="design-system__title">Design System</h1>
        <p class="design-system__intro">
            A lightweight style reference built from the current Mara Danz visual language:
            dark monochrome palette, uppercase editorial headings, compact utility spacing and simple rounded controls.
        </p>
    </header>

    <section class="design-system__section">
        <h2 class="design-system__section-title">Color</h2>
        <div class="design-system__swatches">
            <div class="design-system__swatch">
                <div class="design-system__swatch-color" style="background: var(--bg-color);"></div>
                <div class="design-system__swatch-meta">`--bg-color`</div>
            </div>
            <div class="design-system__swatch">
                <div class="design-system__swatch-color" style="background: var(--color-primary);"></div>
                <div class="design-system__swatch-meta">`--color-primary`</div>
            </div>
            <div class="design-system__swatch">
                <div class="design-system__swatch-color" style="background: var(--color-primary-light);"></div>
                <div class="design-system__swatch-meta">`--color-primary-light`</div>
            </div>
            <div class="design-system__swatch">
                <div class="design-system__swatch-color" style="background: var(--color-primary-lighter);"></div>
                <div class="design-system__swatch-meta">`--color-primary-lighter`</div>
            </div>
        </div>
    </section>

    <section class="design-system__section">
        <h2 class="design-system__section-title">Typography</h2>
        <div class="design-system__grid">
            <article class="design-system__card">
                <p class="design-system__label">Heading family</p>
                <div class="design-system__type-row">
                    <h3 class="design-system__heading-demo" style="font-size: var(--font-xl);">Display / Title</h3>
                </div>
                <div class="design-system__type-row">
                    <h3 class="design-system__heading-demo" style="font-size: var(--font-lg);">Section heading</h3>
                </div>
            </article>
            <article class="design-system__card">
                <p class="design-system__label">Body family</p>
                <div class="design-system__type-row">
                    <p class="design-system__body-demo" style="font-size: var(--text-md);">
                        Body copy sentence example with existing text rhythm and proportions.
                    </p>
                </div>
                <div class="design-system__type-row">
                    <p class="design-system__body-demo" style="font-size: var(--text-sm);">
                        Secondary/supporting copy in a smaller size.
                    </p>
                </div>
            </article>
        </div>
    </section>

    <section class="design-system__section">
        <h2 class="design-system__section-title">Spacing</h2>
        <article class="design-system__card">
            <div class="design-system__spacing-list">
                <div class="design-system__spacing-item"><span>xxxs</span><span class="design-system__spacing-bar" style="width: var(--space-xxxs);"></span></div>
                <div class="design-system__spacing-item"><span>xs</span><span class="design-system__spacing-bar" style="width: var(--space-xs);"></span></div>
                <div class="design-system__spacing-item"><span>sm</span><span class="design-system__spacing-bar" style="width: var(--space-sm);"></span></div>
                <div class="design-system__spacing-item"><span>md</span><span class="design-system__spacing-bar" style="width: var(--space-md);"></span></div>
                <div class="design-system__spacing-item"><span>lg</span><span class="design-system__spacing-bar" style="width: var(--space-lg);"></span></div>
                <div class="design-system__spacing-item"><span>xl</span><span class="design-system__spacing-bar" style="width: var(--space-xl);"></span></div>
            </div>
        </article>
    </section>

    <section class="design-system__section">
        <h2 class="design-system__section-title">Components</h2>
        <div class="design-system__grid">
            <article class="design-system__card">
                <p class="design-system__label">Buttons</p>
                <div class="design-system__button-row">
                    <button class="design-system__btn" type="button">Primary</button>
                    <button class="design-system__btn design-system__btn--ghost" type="button">Ghost</button>
                </div>
            </article>
            <article class="design-system__card">
                <p class="design-system__label">Input</p>
                <label class="design-system__kicker" for="ds-email">Newsletter</label>
                <input class="design-system__field" id="ds-email" type="email" placeholder="email address">
            </article>
            <article class="design-system__card">
                <p class="design-system__label">Surface / Card</p>
                <div class="design-system__surface-demo">
                    <p class="design-system__body-demo">
                        Neutral elevated surface for overlays, cards or callouts.
                    </p>
                </div>
            </article>
        </div>
    </section>
</main>

<?php endslot() ?>
<?php endsnippet() ?>
