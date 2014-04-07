<?php
/**
 * This class inserts a settings screen to the "Plugins" admin menu.
 * It shows some recommended plugins you can immediately download,
 * activate and apply settings to it.
 *
 * @package TrendPress
 */

class TP_Recommended_Plugins {
	/**
	 * Recommended plugins
	 *
	 * @var array
	 */
	var $recommended = array();
	
	/**
	 * Optional plugins
	 *
	 * @var array
	 */
	var $optional = array();

	/**
	 * Developer tools
	 *
	 * @var array
	 */
	var $development = array();
	
	function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_page' ) );
		
		//Enqueue scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		
		//Initialize variables
		add_action( 'init', array( $this, 'init_vars' ), 1 );
		
		//Check if 'Apply settings' has been clicked
		add_action( 'init', array( $this, 'handle_settings' ) );
		
		//Redirect after activation
		add_action( 'init', array( $this, 'redirect_after_activation' ) );
		
		//Show activation message
		if( isset( $_GET['activated'] ) && 'tp-recommended-plugins' == $_GET['page'] ) 
			add_action( 'admin_notices', array( $this, 'show_plugin_activated' ) );
		
		//Add recommended link after install
		add_filter( 'update_plugin_complete_actions', array( $this, 'add_recommended_link' ) );
		add_filter( 'install_plugin_complete_actions', array( $this, 'add_recommended_link' ) );
	}
	
	function init_vars() {
		//Setup recommended plugins
		$this->recommended = array(
			'wordpress-seo' => array(
				'name' => 'WordPress SEO',
				'description' => __( 'Improve your SEO: Write better content and have a fully optimized WordPress site.', 'tp' ),
				'path' => 'wordpress-seo/wp-seo.php',
				'settings' => true,
			),
			'google-analytics-for-wordpress' => array(
				'name' => 'Google Analytics for WordPress',
				'description' => __( 'Add Google Analytics to the website to track user statistics.', 'tp' ),
				'path' => 'google-analytics-for-wordpress/googleanalytics.php',
			),
			'w3-total-cache' => array(
				'name' => 'W3 Total Cache',
				'description' => __( 'Improve site performance and user experience via caching: browser, page, object, database, minify and content delivery network support.', 'tp' ),
				'path' => 'w3-total-cache/w3-total-cache.php',
			),
			'limit-login-attempts' => array(
				'name' => 'Limit login attempts',
				'description' => __( 'Limits the maximum number of login attempts to increase security and protect the website against brute force attacks.', 'tp' ),
				'path' => 'limit-login-attempts/limit-login-attempts.php',
			),
		);
		
		$this->optional = array(
			'multiple-content-blocks' => array(
				'name' => 'Multiple content blocks',
				'description' => __( 'Display more than one content field on WordPress pages and posts.', 'tp' ),
				'path' => 'multiple-content-blocks/multiple-content-blocks.php',
			),
			'disqus-comment-system' => array(
				'name' => 'Disqus',
				'description' => __( 'Replaces your WordPress comment system with your comments hosted and powered by Disqus.', 'tp' ),
				'path' => 'disqus-comment-system/disqus.php',
			),
			'social' => array(
				'name' => 'Social',
				'description' => __( 'Broadcast posts to Twitter and/or Facebook, pull in reactions from Twitter and Facebook as comments.', 'tp' ),
				'path' => 'social/social.php',
			),
			'gravity-forms-placeholder' => array(
				'name' => 'Gravity Forms Placeholders',
				'description' => __( 'Adds HTML5 placeholder support to Gravity Forms fields with a Javascript fallback. Javascript & jQuery are required.', 'tp' ),
				'path' => 'gravity-forms-placeholders/gravityforms-placeholders.php',
			),
		);

		$this->development = array(
			'regenerate-thumbnails' => array(
				'name' => 'Regenerate Thumbnails',
				'description' => __( 'Allows you to regenerate your thumbnails after changing the thumbnail sizes.', 'tp' ),
				'path' => 'regenerate-thumbnails/regenerate-thumbnails.php',
			),
			'wp-htaccess-control' => array(
				'name' => 'WP htaccess Control',
				'description' => __( 'Interface to customize the permalinks (author, category, archives and pagination) and htaccess file generated by WordPress.', 'tp' ),
				'path' => 'wp-htaccess-control/wp-htaccess-control.php',
			),
		);
		
		//Register activation hooks
		$this->setup_activation();
	}
	
	
	/**
	 * Add the admin page to the menu
	 */
	function add_admin_page() {
		add_plugins_page( __( 'Recommended plugins', 'tp' ), __( 'Recommended', 'tp' ), 'install_plugins', 'tp-recommended-plugins', array( $this, 'admin_page' ) );
	}
	
	
	/**
	 * Show the admin panel
	 */
	function admin_page() {		
		include( 'views/recommended-plugins.php' );
	}
	
	
	/**
	 * Shows a message that a recommended plugin is activated
	 */
	function show_plugin_activated() {
		?>

		<div class="updated" id="message">
			<p>
				<?php _e( 'Recommended plugin <strong>activated</strong>.', 'tp' ); ?>
			</p>
		</div>

		<?php
	}
	
	/**
	 * Shows available plugins in a table
	 *
	 * @param array $plugins The list of plugins that has to be shown
	 */
	function show_plugins( $plugins ) {
		include( 'views/plugin-table.php' );
	}
	
	/**
	 * Enqueue scripts
	 */
	function enqueue_scripts() {
		wp_enqueue_script( 'thickbox' );
		wp_enqueue_style( 'thickbox' );
	}
	
	/**
	 * Check if a plugin is installed
	 *
	 * @param string $path The path to the plugin folder & file
	 */
	function has_plugin( $path ) {
		return file_exists( ABSPATH . '/wp-content/plugins/' . $path );
	}
	
	/**
	 * Handle the 'Apply settings' buttons
	 */
	function handle_settings() {
		if( isset( $_GET['settings'] ) && 'tp-recommended-plugins' && $_GET['page'] ) {
			add_action( 'admin_notices', array( $this, 'show_settings_updated' ) );
			
			//Apply settings, different each plugin
			$plugins = array_merge( $this->recommended, $this->optional, $this->development );
			$plugin = $plugins[ $_GET['settings'] ];
			
			//Yoast SEO settings
			if( 'wordpress-seo' == $_GET['settings'] ) {
				$options = get_option( 'wpseo_xml' );
				$options['enablexmlsitemap'] = 'on';
				update_option( 'wpseo_xml', $options );
			}
		}
	}
	
	/**
	 * Show the apply settings message
	 */
	function show_settings_updated() {
		$plugins = array_merge( $this->recommended, $this->optional, $this->development );
		$plugin = $plugins[ $_GET['settings'] ];
		?>

		<div class="updated" id="message">
			<p>
				<?php printf( __( 'The plugin <strong>%1$s</strong> has been reset to the recommended TrendPress settings.', 'tp' ), $plugin['name'] ); ?>
			</p>
		</div>

		<?php
	}
	
	/**
	 * Adds an activation hook to all plugins to redirect on activation
	 */
	function setup_activation() {
		add_action( 'activate_plugin', array( $this, 'setup_exceptions' ) );

		foreach( array_merge( $this->recommended, $this->optional, $this->development ) as $name => $plugin )
			register_activation_hook( $plugin['path'], array( $this, 'plugin_activated' ) );
	}
	
	/**
	 * Some exceptional code. This is probably based on single plugins
	 */
	function setup_exceptions() {
		//Ofcourse WordPress SEO needs some tweaking..
		remove_action( 'activate_wordpress-seo/wp-seo.php', 'wpseo_activate' );
	}
	
	/**
	 * Sets redirection to true
	 */
	function plugin_activated() {
		update_option( 'recommended_plugins_do_activation_redirect', 'true' );
	}
	
	/**
	 * Redirects to 'recommended plugins' when one of the recommended plugins is activated
	 */
	function redirect_after_activation() {
		if( get_option( 'recommended_plugins_do_activation_redirect', false ) ) {
			delete_option( 'recommended_plugins_do_activation_redirect' );
			wp_redirect( admin_url( 'plugins.php?page=tp-recommended-plugins&activated' ) );
		}
	}
	
	/**
	 * Adds recommended link after installing a recommended plugin
	 */
	function add_recommended_link( $links ) {
		if( ! isset( $_GET['plugin'] ) ) 
			return $links;
		
		if( isset( $this->recommended[ $_GET['plugin'] ] ) || isset( $this->optional[ $_GET['plugin'] ] ) || isset( $this->development[ $_GET['plugin'] ] ) )
			$links[] = sprintf( __( '<a href="%1$s">Return to recommended plugins</a>', 'tp' ), admin_url( 'plugins.php?page=tp-recommended-plugins' ) );
		
		return $links;
	}
} new TP_Recommended_Plugins;