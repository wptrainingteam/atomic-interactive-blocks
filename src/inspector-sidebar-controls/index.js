/**
 * WordPress Dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import Controls from './controls';

/**
 * Add the interactivity api controls to all blocks that support block.
 */
addFilter(
	'editor.BlockEdit',
	`atomic-interactivity-controls`,
	createHigherOrderComponent(
		(BlockEdit) =>
			function BlockInteractivityControls(props) {
				const {
					name,
					attributes,
					setAttributes,
					clientId,
					isSelected,
					context,
				} = props;

				const supportsInteractivity = useSelect(
					(select) =>
						select('core/blocks').getBlockSupport(
							name,
							'interactivity'
						),
					[name]
				);

        // If our block does not support interactivity, and if it's not currently selected
        // then we'll return the <BlockEdit/> component unchanged. 
				if (!supportsInteractivity || !isSelected) {
					return <BlockEdit {...props} />;
				}

				return (
					<Fragment>
						<BlockEdit {...props} />
						<Controls
							{...{
								attributes,
								setAttributes,
								clientId,
								context,
							}}
						/>
					</Fragment>
				);
			},
		'with-atomic-interactivity-controls'
	),
	100
);

addFilter(
	'blocks.registerBlockType',
	`atomic-interactivity-api-supports`,
	(settings) => {
    // Here we're checking if our block supports interactivity api.
    // Blocks must opt in to the interactivity api with supports.interactivity = true in their block.json
		if (settings?.supports?.interactivity) {
      // For interactive blocks we're going to add 1 attribute with two properties, globally.
      // interactivitySettings contains the following properties:
      // 1. targetNamespace: This is a simple string that should follow the `block-namepsace/block-name` structure
      // 2. subsumption: This is a simple boolean that when enabled will allow us to convert the markup of our block from "target namespace" usage to "subsumption" usage.
			settings.attributes = {
				...settings.attributes,
				interactivitySettings: {
					type: 'object',
          default: {
            targetNamespace: '',
            subsumption: false,
          },
				},
			};
			settings.usesContext = [
				...settings.usesContext,
				'interactivitySettings',
			];
		}

		return settings;
	},
	100
);
