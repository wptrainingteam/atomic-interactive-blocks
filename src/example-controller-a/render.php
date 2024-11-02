<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	get_block_wrapper_attributes([
		'data-wp-interactive' => wp_json_encode([
			'namespace' => 'wp-dev-blog/example-controller-a',
		]),
		'data-wp-context' => wp_json_encode([
		]),
	]),
	$content
);


