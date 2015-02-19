<?php
get_header();
?>

<section id="main" class="container">

	<div class="container-inner">
	
		<article id="content">
		
			<h1>
				<?php _e( 'The page you are looking for doesn\'t exist.', 'tp' ); ?>
			</h1>
			
			<p>
				<strong>
					<?php _e( 'Seems like the page you were looking for might have been moved or just didn\'t exist in the first place.', 'tp' ); ?>
				</strong>
			</p>
			
			<p>
				<?php printf( __( 'You might want to check out our <a href="%1$s">sitemap</a> or use the searchform below to find the page you are looking for.', 'tp' ), trailingslashit( home_url( __( 'sitemap', 'tp' ) ) ) ); ?>
			</p>
			
			<?php get_search_form(); ?>
			
		</article>
		
	</div>
	
</section>

<?php
get_footer();
