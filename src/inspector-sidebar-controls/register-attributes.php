<?php
/**
* Register additional attributes for the core-group block
* @hook block_type_metadata 100, 1
* @param mixed $metadata
* @return mixed
*/
function add_attributes( $metadata ) {
	if ( true !== $metadata['supports']['interactivity'] ) {
		return $metadata;
	}
	if ( ! array_key_exists( 'interactivitySettings', $metadata['attributes'] ) ) {
		$metadata['attributes']['interactivitySettings'] = array(
			'type'    => 'object',
			'default' => [
				'subsumption' => false,
				'targetNamespace' => ''
			]
		);
	}
	return $metadata;
}
add_filter( 'block_type_metadata', 'add_atomic_interactive_attributes' );