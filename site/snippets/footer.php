<?php if (page('shop')->isOpen()) : ?>
    <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.css" />
    <link type="text/css" href="/assets/css/snipcart.css" rel="stylesheet /">
    <script async src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js"></script>
    <div id="snipcart" data-config-modal-style="side" data-api-key="YmE3ZWFlMjQtY2I0OC00YjkxLTkzZGItYWJlMDhhZDIxM2U4NjM3NjMyMzk2OTU0NTg5Mzgx" hidden></div>
<?php endif ?>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/ScrollToPlugin.min.js"></script>

<?= Bnomei\Fingerprint::js('assets/js/scripts.min.js'); ?>
</body>

</html>