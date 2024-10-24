<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
?>
<p <?php echo get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => 'wp-dev-blog/example-b',
	]),
	'data-wp-context' => wp_json_encode([
		'emoji' => '🤔',
	]),
	'data-wp-text' => 'context.emoji',
	'data-wp-on--click' => 'actions.onClick',
]); ?>>
</p>
