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
 * Add the interactivity api controls to all blocks that support it.
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
		if (settings?.supports?.interactivity) {
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