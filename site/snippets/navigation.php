     <nav class="navigation">
         <ul>
             <?php foreach ($pages->listed() as $menuItem): ?>
             <li>
                 <a class="header-text <?php e($menuItem->isOpen() , 'is-active') ?>"
                     href="<?=$menuItem->url() ?>"><?=$menuItem->title() ?></a>
             </li>
             <?php endforeach ?>

         </ul>
         <div class="menu-overlay">
         </div>
     </nav>

     <?php if ($page != 'home'): ?>
     <?php snippet('info_box') ?>
     <?php  endif ?>