<div class="info-box">
    <div class="info-header">
        <div class="info-button">
            <button>
                Info
            </button>
        </div>
        <div class="info-logo">
            <?php if($page != 'home'): ?>
            <a href="<?= $site->url() ?>">
                <?= $site->file('danz_typo.png') ?>
            </a>

            <?php endif ?>

        </div>
    </div>
    <div class="info-container">
        <div class="info-symbol">
            <?= $site->file('danz_symbol.png') ?>
        </div>
        <div>
            <h3> <?= $site->customfield_title() ?></h3>
            <?= $site->customField()->kirbytext() ?>
        </div>
        <div>
            <div>
                <h3>Contact</h3>
                <p>M: <a href="mailto:<?= $site->mail() ?>"><?= $site->mail() ?></a> <br>
                    IG: <a href="mailto:<?= $site->instagram() ?>">@Mara_Danz</a>
            </div>
            <div>
                <h3>Newsletter</h3>
                <!-- Begin Mailchimp Signup Form -->
                <link href="//cdn-images.mailchimp.com/embedcode/slim-10_7.css" rel="stylesheet" type="text/css">
                </p>
                <div id="mc_embed_signup">
                    <form action="<?= $site->newsletter() ?>" method="post" id="mc-embedded-subscribe-form"
                        name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
                        <div id="mc_embed_signup_scroll">
                            <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL"
                                placeholder="email address" required>
                            <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                            <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text"
                                    name="b_a0eac11fe344c8178258d55ae_2937726059" tabindex="-1" value=""></div>
                            <div class="clear"><input type="submit" value="Subscribe" name="subscribe"
                                    id="mc-embedded-subscribe" class="button"></div>
                        </div>
                    </form>
                </div>
                <!--End mc_embed_signup-->
            </div>

        </div>
        <div>
            <div>
                <h3>Address</h3>
                <p>
                    DANZ <br>
                    Zollhausstrasse 4 <br>
                    Glarus 8750<br>
                    Switzerland<br>
                </p>
            </div>
            <div>
                <p>
                    DESIGN & CODE<br>
                    vonwilhelm.ch
                </p>
            </div>
        </div>
    </div>
</div>