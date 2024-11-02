<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
$target_namespace = $attributes['targetNamespace'];
if ( ! $target_namespace ) {
	return;
}
?>
<input <?php echo get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => $target_namespace,
	]),
	'data-wp-context' => wp_json_encode([
		'value' => '',
		'type' => 'text',
	]),
	'data-wp-on--change' => 'actions.onChange',
	'data-wp-on--focus' => 'actions.onFocus',
	'data-wp-on--blur' => 'actions.onBlur',
	'data-wp-bind--value' => 'context.value',
	'data-wp-bind--type' => 'context.type',
]); ?>>
</input>
