<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

wp_interactivity_state('wp-dev-blog/example-a', [
	'content' => 'Hello World, from Block A',
]);

?>
<p <?php echo get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => 'wp-dev-blog/example-a',
	]),
	'data-wp-text' => 'state.content',
]); ?>>
</p>
