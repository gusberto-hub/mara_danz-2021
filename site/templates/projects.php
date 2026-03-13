<?php snippet('layout', slots: true) ?>
<?php slot() ?>

<div class="main-container project-grid">
    <?php
    $projects = $page->children()
        ->listed()
        ->filterBy('intendedTemplate', 'project');
    ?>
    <?php foreach ($projects as $project) : ?>
        <?php
        $cover = $project->coverimage()->toFile();
        if (!$cover) {
            $cover = $project->image();
        }
        $hoverCover = null;
        if ($cover) {
            $hoverCover = $project->images()->filterBy('filename', '!=', $cover->filename())->first();
        }
        if (!$hoverCover) {
            $hoverCover = $cover;
        }
        ?>
        <div class="project">
            <div class="project__content">
                <a href="<?= $project->url() ?>">
                    <h3 class="project__title"><?= $project->projecttitle()->or($project->title()) ?></h3>
                </a>
                <!-- <p>
                    <?= $project->projecttitle()->or($project->title()) ?>
                    <?php if ($project->subtitle()->isNotEmpty()) : ?>, <?= $project->subtitle() ?><?php endif ?>
                    <?php if ($project->location()->isNotEmpty()) : ?>, <?= $project->location() ?><?php endif ?>
                    <?php if ($project->year()->isNotEmpty()) : ?>, <?= $project->year() ?><?php endif ?>
                </p> -->
            </div>
            <div class="project__thumbnail">
                <?php if ($cover) : ?>
                    <img class="project__thumbnail-bg" src="<?= $hoverCover->thumb(['width' => 900, 'format' => 'webp'])->url() ?>" alt="<?= $project->projecttitle()->or($project->title())->esc() ?>">
                <?php endif ?>
                <?php if ($cover) : ?>
                    <img class="project__thumbnail-image" src="<?= $cover->thumb(['width' => 900, 'format' => 'webp'])->url() ?>" alt="<?= $project->projecttitle()->or($project->title())->esc() ?>">
                <?php endif ?>
                <?php if ($hoverCover) : ?>
                    <img class="project__thumbnail-hover" src="<?= $hoverCover->thumb(['width' => 1200, 'format' => 'webp'])->url() ?>" alt="<?= $project->projecttitle()->or($project->title())->esc() ?>">
                <?php endif ?>
            </div>
        </div>
    <?php endforeach ?>
</div>

<script>
    (() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const images = [...document.querySelectorAll('.project__thumbnail-bg')];
        if (!images.length) return;

        const visible = new Set();
        const states = new Map(
            images.map((image) => {
                return [image, {
                    x: 0,
                    y: 0,
                    tx: 0,
                    ty: 0
                }];
            })
        );

        let pointerX = 0;
        let pointerY = 0;
        let rafId = null;

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            });
        }, {
            threshold: 0.25
        });

        images.forEach((image) => io.observe(image));

        window.addEventListener('mousemove', (event) => {
            pointerX = event.clientX / window.innerWidth - 0.5;
            pointerY = event.clientY / window.innerHeight - 0.5;
        }, {
            passive: true
        });

        const maxOffset = 120; // subtle movement

        const tick = () => {
            states.forEach((state, image) => {
                if (visible.has(image)) {
                    // Move slightly opposite to cursor direction.
                    state.tx = -pointerX * maxOffset;
                    state.ty = -pointerY * maxOffset;
                } else {
                    state.tx = 0;
                    state.ty = 0;
                }

                state.x += (state.tx - state.x);
                state.y += (state.ty - state.y);
                image.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
            });

            rafId = requestAnimationFrame(tick);
        };

        if (!rafId) rafId = requestAnimationFrame(tick);
    })();
</script>

<?php endslot() ?>
<?php endsnippet() ?>