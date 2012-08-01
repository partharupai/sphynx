<!DOCTYPE html>
<!--[if IE 7 ]><html class="no-js ie ie7" lang="nl"><![endif]-->
<!--[if IE 8 ]><html class="no-js ie ie8" lang="nl"><![endif]-->
<!--[if IE 9 ]><html class="no-js ie ie9" lang="nl"><![endif]-->
<!--[if gt IE 9]><html class="no-js ie" lang="nl"><![endif]-->
<!--[if !IE]><!-->
<html class="no-js" <?php language_attributes(); ?>>
<!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo('charset'); ?>" />
		<meta name="author" content="Trendwerk" />
		<meta name ="viewport" content ="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width" />
		<title><?php wp_title(); ?></title>
		<link rel="alternate" type="application/rss+xml" href="<?php bloginfo('rss2_url'); ?>" title="<?php bloginfo('name'); ?> RSS Feed" />
		<link rel="apple-touch-icon" type="image/x-icon" href="<?php bloginfo('template_url')?>/assets/img/favicon/apple-touch-icon.png" />
		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
		<link rel="profile" href="http://gmpg.org/xfn/11" />
		<link rel="shortcut icon" type="image/png" href="<?php bloginfo('template_url')?>/assets/img/favicon/favicon.ico" />
		<link rel="stylesheet" type="text/css" media="screen, projection" href="<?php bloginfo('stylesheet_url'); ?>" />
		<link rel="stylesheet" type="text/css" media="print" href="<?php echo get_template_directory_uri() ?>/assets/css/print.css" />	
		<!-- 
		<link rel="stylesheet/less" type="text/css" media="screen, projections" href="<?php bloginfo('template_url')?>/assets/script/less/styles.less">
		<script src="<?php bloginfo('template_url')?>/assets/script/less/less-1.3.0.min.js" type="text/javascript"></script>
		-->
		<script type="text/javascript" src="<?php bloginfo('template_url')?>/assets/script/modernizr/modernizr.dev.js"></script>	
		<?php wp_head();?>
	</head>
	<body <?php body_class('g960'); ?>>
		<header id="main-header" class="container">
			<div class="inner">
				<div id="logo" class="ninecol">
					<p id="logo-p"><a href="<?php bloginfo('url'); ?>"><?php bloginfo('name'); ?></a></p>
					<p id="tagline"><?php bloginfo('description'); ?> </p>
				</div>
				<div id="search" class="threecol last right">
					<?php get_search_form(); ?>
				</div>
				<div class="menu-topnavigatie-container">
					<ul id="topmenu" class="navigation">
						<?php wp_nav_menu( array(
							'menu' => 'Topnavigatie',
							'depth' => '0',
							'container' => '',
							'items_wrap' => '%3$s' )); 
						?>						
					</ul>
				</div>
			</div>
		</header>
		<nav id="main-navigation" class="container">
			<div class="inner">
				<ul id="hoofdnavigatie" class="navigation twelvecol sf-menu">
					<?php wp_nav_menu( array(
						'menu' => 'Hoofdnavigatie',
						'depth' => '0',
						'container' => '',
						'items_wrap' => '%3$s'
					)); ?>
				</ul>
			</div>	
		</nav>
		<section id="main" class="container">