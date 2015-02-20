<?php
if ( post_password_required() )
	return;
?>

<div id="comments">

	<?php 
		if ( have_comments() ) { 
			?>
	
			<h2>
				<?php printf( _n( 'One response to &ldquo;%2$s&rdquo;', '%1$s responses to &ldquo;%2$s&rdquo;', get_comments_number(), 'tp' ), get_comments_number(), '<span>' . get_the_title() . '</span>' ); ?>
			</h2>
			
			<ol>
				<?php 
					wp_list_comments( array(
						'avatar_size' => 60,
					) );
				?>
			</ol>
		
			<?php
			$pagination = paginate_comments_links( array(
				'next_text' => __( 'Next', 'tp' ),
				'prev_text' => __( 'Previous', 'tp' ),
				'echo'      => false,
			) );

			if( 0 < strlen( $pagination ) )
				echo '<nav id="pager">' . $pagination . '</nav>';
		}

		comment_form( array(
			'comment_notes_after' => '',
		) );
	?>

</div>
