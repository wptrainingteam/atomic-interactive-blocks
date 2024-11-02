<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
$target_namespace = $attributes['targetNamespace'];
if ( ! $target_namespace ) {
	return;
}
?>
<button <?php echo get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => $target_namespace,
	]),
	'data-wp-context' => wp_json_encode([
		'value' => '',
	]),
	'data-wp-on--click' => 'actions.onClick',
	'data-wp-text' => 'context.value',
]); ?>>
</button>
