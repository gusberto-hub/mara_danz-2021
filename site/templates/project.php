<?php snippet('layout', slots: true) ?>
<?php slot() ?>
<?php
$projects = $page->siblings()
    ->listed()
    ->filterBy('intendedTemplate', 'project')
    ->sortBy('num', 'asc');
$currentIndex = $projects->indexOf($page);
$prevProject = $currentIndex !== false && $currentIndex > 0 ? $projects->nth($currentIndex - 1) : null;
$nextProject = $currentIndex !== false && $currentIndex < $projects->count() - 1 ? $projects->nth($currentIndex + 1) : null;
$layouts = $page->layout()->toLayouts();
?>

<div class="main-container project-detail">
    <h1 class="project-detail__title">
        <?= $page->projecttitle()->or($page->title()) ?>
    </h1>
    <?php foreach ($layouts as $layout) : ?>
        <div class="collab" id="<?= $layout->id() ?>">
            <?php foreach ($layout->columns() as $column) : ?>
                <div class="column" style="--span:<?= $column->span() ?>">
                    <div class="blocks">
                        <?php
                        $renderedBlocks = (string)$column->blocks();
                        echo $renderedBlocks;
                        ?>
                    </div>
                </div>
            <?php endforeach ?>
        </div>
    <?php endforeach ?>

    <?php if ($prevProject || $nextProject) : ?>
        <nav class="project-nav" aria-label="Project navigation">
            <div class="project-nav__item project-nav__item--prev">
                <?php if ($prevProject) : ?>
                    <a href="<?= $prevProject->url() ?>" rel="prev">
                        <span class="project-nav__label">Prev</span>
                        <span class="project-nav__title"><?= $prevProject->projecttitle()->or($prevProject->title()) ?></span>
                    </a>
                <?php endif ?>
            </div>
            <div class="project-nav__item project-nav__item--next">
                <?php if ($nextProject) : ?>
                    <a href="<?= $nextProject->url() ?>" rel="next">
                        <span class="project-nav__label">Next</span>
                        <span class="project-nav__title"><?= $nextProject->projecttitle()->or($nextProject->title()) ?></span>
                    </a>
                <?php endif ?>
            </div>
        </nav>
    <?php endif ?>
</div>

<script>
    (() => {
        const getGalleryItems = () => [...document.querySelectorAll('.project-detail .gallery-block img, .project-detail .campaign-video iframe, .project-detail .campaign-video video')]
            .map((el) => {
                const tagName = el.tagName.toLowerCase();
                if (tagName === 'img') {
                    return {
                        type: 'image',
                        el,
                        src: el.currentSrc || el.src,
                        alt: el.alt || ''
                    };
                }

                if (tagName === 'video') {
                    return {
                        type: 'video',
                        el
                    };
                }

                if (tagName === 'iframe') {
                    return {
                        type: 'iframe',
                        el,
                        src: el.src
                    };
                }

                return null;
            })
            .filter(Boolean);

        const withAutoplay = (src) => {
            if (!src) return src;
            try {
                const url = new URL(src, window.location.origin);
                url.searchParams.set('autoplay', '1');
                return url.toString();
            } catch (error) {
                const separator = src.includes('?') ? '&' : '?';
                return `${src}${separator}autoplay=1`;
            }
        };

        let lightbox = null;
        let mediaEl = null;
        let controls = null;
        let currentIndex = 0;
        let transitionInFlight = false;

        const ensureLightbox = () => {
            if (lightbox) return;
            lightbox = document.createElement('div');
            lightbox.className = 'project-lightbox';
            lightbox.innerHTML = `
                <button class="project-lightbox__backdrop" type="button" aria-label="Close slideshow"></button>
                <div class="project-lightbox__inner" role="dialog" aria-modal="true" aria-label="Media slideshow">
                    <div class="project-lightbox__media"></div>
                    <nav class="project-lightbox__controls" aria-label="Slideshow controls">
                        <button class="project-lightbox__control" type="button" data-action="prev">Prev</button>
                        <button class="project-lightbox__control" type="button" data-action="close">Close</button>
                        <button class="project-lightbox__control" type="button" data-action="next">Next</button>
                    </nav>
                </div>
            `;
            document.body.append(lightbox);

            mediaEl = lightbox.querySelector('.project-lightbox__media');
            controls = lightbox.querySelector('.project-lightbox__controls');
            const backdrop = lightbox.querySelector('.project-lightbox__backdrop');

            backdrop.addEventListener('click', close);
            controls.addEventListener('click', (event) => {
                const btn = event.target.closest('[data-action]');
                if (!btn) return;
                const action = btn.dataset.action;
                if (action === 'close') close();
                if (action === 'prev') goPrev();
                if (action === 'next') goNext();
            });
        };

        const stopActiveMedia = () => {
            if (!mediaEl) return;
            const activeMedia = mediaEl.firstElementChild;
            if (!activeMedia) return;

            if (activeMedia.tagName.toLowerCase() === 'video') {
                activeMedia.pause();
                activeMedia.currentTime = 0;
            }

            if (activeMedia.tagName.toLowerCase() === 'iframe') {
                activeMedia.src = '';
            }
        };

        const render = () => {
            const galleryItems = getGalleryItems();
            const source = galleryItems[currentIndex];
            if (!source || !mediaEl) return;

            stopActiveMedia();
            mediaEl.innerHTML = '';

            if (source.type === 'image') {
                const img = document.createElement('img');
                img.className = 'project-lightbox__image';
                img.src = source.src;
                img.alt = source.alt;
                mediaEl.append(img);
                return;
            }

            if (source.type === 'video') {
                const video = source.el.cloneNode(true);
                video.classList.add('project-lightbox__video');
                video.controls = true;
                video.autoplay = true;
                mediaEl.append(video);
                video.play().catch(() => {});
                return;
            }

            if (source.type === 'iframe') {
                const iframe = document.createElement('iframe');
                iframe.className = 'project-lightbox__iframe';
                iframe.src = withAutoplay(source.src);
                iframe.allow = source.el.getAttribute('allow') || 'autoplay; fullscreen; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.loading = 'lazy';
                iframe.referrerPolicy = source.el.referrerPolicy || 'strict-origin-when-cross-origin';
                mediaEl.append(iframe);
            }
        };

        const resetViewTransitionNames = () => {
            if (mediaEl?.firstElementChild instanceof HTMLImageElement) {
                mediaEl.firstElementChild.style.viewTransitionName = '';
            }
            getGalleryItems().forEach((item) => {
                if (item.type !== 'image') return;
                item.el.style.viewTransitionName = '';
            });
        };

        const openAt = (index, sourceImageEl = null) => {
            ensureLightbox();
            if (transitionInFlight) return;
            currentIndex = index;

            const openLightbox = ({ renderSlide = true } = {}) => {
                if (renderSlide) render();
                lightbox.classList.add('project-lightbox--is-open');
                document.body.style.overflow = 'hidden';
            };

            if (typeof document.startViewTransition !== 'function' || !sourceImageEl) {
                openLightbox();
                return;
            }

            const vtName = `project-lightbox-image-${Date.now()}`;
            resetViewTransitionNames();
            sourceImageEl.style.viewTransitionName = vtName;
            render();
            const activeImage = mediaEl?.firstElementChild;
            if (!(activeImage instanceof HTMLImageElement)) {
                openLightbox();
                return;
            }

            try {
                transitionInFlight = true;
                const transition = document.startViewTransition(() => {
                    sourceImageEl.style.viewTransitionName = '';
                    openLightbox({ renderSlide: false });
                    activeImage.style.viewTransitionName = vtName;
                });

                transition.finished.finally(() => {
                    resetViewTransitionNames();
                    transitionInFlight = false;
                });
            } catch (error) {
                // Fallback for browsers that abort transition in invalid states.
                resetViewTransitionNames();
                transitionInFlight = false;
                openLightbox();
            }
        };

        const close = () => {
            if (!lightbox) return;
            if (transitionInFlight) return;
            stopActiveMedia();
            lightbox.classList.remove('project-lightbox--is-open');
            document.body.style.overflow = '';
            resetViewTransitionNames();
        };

        const goPrev = () => {
            const galleryItems = getGalleryItems();
            if (!galleryItems.length) return;
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            render();
        };

        const goNext = () => {
            const galleryItems = getGalleryItems();
            if (!galleryItems.length) return;
            currentIndex = (currentIndex + 1) % galleryItems.length;
            render();
        };

        document.addEventListener('click', (event) => {
            const clickedTarget = event.target.closest('.project-detail .gallery-block img, .project-detail .campaign-video, .project-detail .campaign-video iframe, .project-detail .campaign-video video');
            if (!clickedTarget) return;
            const clickedItem = clickedTarget.matches('.campaign-video')
                ? clickedTarget.querySelector('iframe, video')
                : clickedTarget;
            if (!clickedItem) return;
            const galleryItems = getGalleryItems();
            const index = galleryItems.findIndex((item) => item.el === clickedItem);
            if (index < 0) return;
            event.preventDefault();
            openAt(index, clickedItem.tagName.toLowerCase() === 'img' ? clickedItem : null);
        });

        document.addEventListener('keydown', (event) => {
            if (!lightbox || !lightbox.classList.contains('project-lightbox--is-open')) return;
            if (event.key === 'Escape') close();
            if (event.key === 'ArrowLeft') goPrev();
            if (event.key === 'ArrowRight') goNext();
        });
    })();
</script>

<?php endslot() ?>
<?php endsnippet() ?>