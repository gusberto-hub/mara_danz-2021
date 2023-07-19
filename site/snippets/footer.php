<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/ScrollToPlugin.min.js"></script>

<?= Bnomei\Fingerprint::js('assets/js/scripts.min.js'); ?>

<?php
$snipcart_api = '';

if ($_SERVER['SERVER_NAME'] === 'maradanz.com') :
    $snipcart_api = "YmE3ZWFlMjQtY2I0OC00YjkxLTkzZGItYWJlMDhhZDIxM2U4NjM3NjMyMzk2OTU0NTg5Mzgx";
else :
    $snipcart_api = "N2JlNTg4M2UtMmVlNy00NGI0LWE4YmMtNmZhZTBhYmU1OGE4NjM3NjMyMzk2OTU0NTg5Mzgx";
endif
?>

<?php if (page('shop')->isOpen()) : ?>
    <script async src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js"></script>
    <div id="snipcart" data-config-modal-style="side" data-api-key=<?= $snipcart_api ?> hidden></div>
<?php endif ?>
<p style="display: none;"><?= $_SERVER['SERVER_NAME'] ?></p>
</body>

</html>