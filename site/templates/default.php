<?php  snippet('header') ?>
<?php  snippet('navigation') ?>

<main id="start-screen">
    <div hidden>
        <?php $bgImage = $site->background()->toFile()->thumb($options = ['width' => 1200 ]) ?>
        <img class='start-screen-bg' src="<?= $bgImage->url() ?>" width="<?= $bgImage->width() ?>"
            height="<?= $bgImage->height() ?>">
    </div>
    <div hidden>
        <?php $bgImageMobile = $site->background_mobile()->toFile()->thumb($options = ['height' => 1000 ]) ?>
        <img class='start-screen-bg-mobile' src="<?= $bgImageMobile->url() ?>" width="<?= $bgImageMobile->width() ?>"
            height="<?= $bgImageMobile->height() ?>">
    </div>

    <div class="start-screen-logo">
        <?php $logoStartScreen = $site->image('danz_logo_outline.png') ?>
        <img src="<?= $logoStartScreen->url() ?>" alt="" width="<?= $logoStartScreen->width() ?>"
            height="<?= $logoStartScreen->height() ?>">
    </div>
    <a class="start-screen-link" href="<?= e($site->futured()->isNotEmpty(), $site->futured()->toPage(),null) ?>">
    </a>
    <div class="start-screen-btn">
        <?php if($site->futured()->isNotEmpty()): ?>
        <a href="<?= $site->futured()->toPage() ?>">
            <?= $site->Button_text() ?>
        </a>
        <?php else: ?>
        <?= $site->Button_text() ?>
        <?php endif ?>
    </div>

</main>

<script type="module">
let bgImage;
const bgImageSelect = () => {
    if (window.innerWidth > window.innerHeight) {
        bgImage = document.querySelector('.start-screen-bg');
    } else {
        bgImage = document.querySelector('.start-screen-bg-mobile');
    }
}

bgImageSelect();
window.onresize = bgImageSelect();

const imgSize = [bgImage.width, bgImage.height];

const vertex = `
					attribute vec2 uv;
					attribute vec2 position;
					varying vec2 vUv;
					void main() {
							vUv = uv;
							gl_Position = vec4(position, 0, 1);
					}
			`;
const fragment = `
					precision highp float;
					precision highp int;
					uniform sampler2D tWater;
					uniform sampler2D tFlow;
					uniform float uTime;
					varying vec2 vUv;
					uniform vec4 res;

					void main() {

							// R and G values are velocity in the x and y direction
							// B value is the velocity length
							vec3 flow = texture2D(tFlow, vUv).rgb;

							vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
							vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
							myUV -= flow.xy * (0.15 * 0.7);

							vec3 tex = texture2D(tWater, myUV).rgb;

							gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.0);
					}
			`; {
    const renderer = new ogl.Renderer({
        dpr: 2
    });
    const gl = renderer.gl;
    const startScreen = document.querySelector('#start-screen')
    startScreen.appendChild(gl.canvas);

    // Variable inputs to control flowmap
    let aspect = 1;
    const mouse = new ogl.Vec2(-1);
    const velocity = new ogl.Vec2();

    function resize() {
        let a1, a2;
        var imageAspect = imgSize[1] / imgSize[0];
        if (window.innerHeight / window.innerWidth < imageAspect) {
            a1 = 1;
            a2 = window.innerHeight / window.innerWidth / imageAspect;
        } else {
            a1 = (window.innerWidth / window.innerHeight) * imageAspect;
            a2 = 1;
        }
        mesh.program.uniforms.res.value = new ogl.Vec4(
            window.innerWidth,
            window.innerHeight,
            a1,
            a2
        );

        renderer.setSize(window.innerWidth, window.innerHeight);
        aspect = window.innerWidth / window.innerHeight;
    }
    const flowmap = new ogl.Flowmap(gl);
    // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
    const geometry = new ogl.Geometry(gl, {
        position: {
            size: 2,
            data: new Float32Array([-1, -1, 3, -1, -1, 3])
        },
        uv: {
            size: 2,
            data: new Float32Array([0, 0, 2, 0, 0, 2])
        }
    });
    const texture = new ogl.Texture(gl, {
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR
    });
    const img = new Image();
    img.onload = () => (texture.image = img);
    img.crossOrigin = "Anonymous";
    img.src = bgImage.src;

    let a1, a2;
    var imageAspect = imgSize[1] / imgSize[0];
    if (window.innerHeight / window.innerWidth < imageAspect) {
        a1 = 1;
        a2 = window.innerHeight / window.innerWidth / imageAspect;
    } else {
        a1 = (window.innerWidth / window.innerHeight) * imageAspect;
        a2 = 1;
    }

    const program = new ogl.Program(gl, {
        vertex,
        fragment,
        uniforms: {
            uTime: {
                value: 0
            },
            tWater: {
                value: texture
            },
            res: {
                value: new ogl.Vec4(window.innerWidth, window.innerHeight, a1, a2)
            },
            img: {
                value: new ogl.Vec2(imgSize[0], imgSize[1])
            },
            // Note that the uniform is applied without using an object and value property
            // This is because the class alternates this texture between two render targets
            // and updates the value property after each render.
            tFlow: flowmap.uniform
        }
    });
    const mesh = new ogl.Mesh(gl, {
        geometry,
        program
    });

    window.addEventListener("resize", resize, false);
    resize();

    // Create handlers to get mouse position and velocity
    const isTouchCapable = "ontouchstart" in window;
    if (isTouchCapable) {
        window.addEventListener("touchstart", updateMouse, false);
        window.addEventListener("touchmove", updateMouse, {
            passive: false
        });
    } else {
        window.addEventListener("mousemove", updateMouse, false);
    }
    let lastTime;
    const lastMouse = new ogl.Vec2();

    function updateMouse(e) {
        e.preventDefault();
        if (e.changedTouches && e.changedTouches.length) {
            e.x = e.changedTouches[0].pageX;
            e.y = e.changedTouches[0].pageY;
        }
        if (e.x === undefined) {
            e.x = e.pageX;
            e.y = e.pageY;
        }
        // Get mouse value in 0 to 1 range, with y flipped
        mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);
        // Calculate velocity
        if (!lastTime) {
            // First frame
            lastTime = performance.now();
            lastMouse.set(e.x, e.y);
        }

        const deltaX = e.x - lastMouse.x;
        const deltaY = e.y - lastMouse.y;

        lastMouse.set(e.x, e.y);

        let time = performance.now();

        // Avoid dividing by 0
        let delta = Math.max(10.4, time - lastTime);
        lastTime = time;
        velocity.x = deltaX / delta;
        velocity.y = deltaY / delta;
        // Flag update to prevent hanging velocity values when not moving
        velocity.needsUpdate = true;
    }
    requestAnimationFrame(update);

    function update(t) {
        requestAnimationFrame(update);
        // Reset velocity when mouse not moving
        if (!velocity.needsUpdate) {
            mouse.set(-1);
            velocity.set(0);
        }
        velocity.needsUpdate = false;
        // Update flowmap inputs
        flowmap.aspect = aspect;
        flowmap.mouse.copy(mouse);
        // Ease velocity input, slower when fading out
        flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
        flowmap.update();
        program.uniforms.uTime.value = t * 0.01;
        renderer.render({
            scene: mesh
        });
    }
}
</script>

<?php snippet('footer') ?>