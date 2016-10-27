<?php
namespace Trendwerk\TrendPress;

final class Gallery
{
    public function __construct()
    {
        add_action('init', [$this, 'replace']);
    }

    public function replace()
    {
        remove_shortcode('gallery');
        add_shortcode('gallery', [$this, 'add']);
    }

    public function add()
    {
        $items = \Timber::get_posts([
            'post_mime_type' => 'image',
            'post_parent'    => get_the_ID(),
            'post_status'    => 'inherit',
            'post_type'      => 'attachment',
            'order'          => 'ASC',
            'orderby'        => 'menu_order ID',
        ]);
    }
}
