<?php
/**
 * Enqueue styles and scripts
 */

namespace Trendwerk\TrendPress;

final class Enqueue
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'frontend'));
    }

    /**
     * Enqueue styles and scripts for front-end
     */
    public function frontend()
    {
        $template_root = get_template_directory_uri();
        $assets = $template_root . '/assets';
        $bower = $template_root . '/bower_components';

        /**
         * Core
         */
        wp_enqueue_script('comment-reply');

        /**
         * Scripts
         */
        wp_enqueue_script('all', $assets . '/scripts/output/all.js', array('jquery', 'fancybox'));
        wp_enqueue_script('fancybox', $bower . '/fancybox/source/jquery.fancybox.js', array('jquery'));

        /**
         * Styles
         */
        wp_enqueue_style('main', $assets . '/styles/output/main.css');
        wp_enqueue_style('fancybox', $bower . '/fancybox/source/jquery.fancybox.css');

        /**
         * jQuery from Google's CDN
         */
        wp_deregister_script('jquery');
        wp_enqueue_script('jquery', '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js');
    }
}
