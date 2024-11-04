/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	ExternalLink,
	TextControl,
	ToggleControl,
	PanelBody,
} from '@wordpress/components';

export default function Controls({
	attributes,
	setAttributes,
	context,
}) {
	const { interacitivtySettings } = attributes;
	const { targetNamespace, subsumption } = interactivitySettings;
	const namespace = targetNamespace || context?.interactivitySettings?.targetNamespace;
	return (
		<InspectorControls>
			<PanelBody title={__('Interactivity API')}>
				<ToggleControl
					label={__('Subsumption', 'atomic-interactivity-controls')}
					checked={subsumption}
					onChange={() =>
						setAttributes({
							interacitivtySettings: {
								...interacitivtySettings,
								subsumption: !subsumption
							}
						})
					}
					help={__(
						'When enabled, this block will inherit interactivity directly from its parent rather than any given namespace.',
						'atomic-interactivity-controls'
					)}
				/>
				{!subsumption && (
					<TextControl
						label={__('Namespace', 'atomic-interactivity-controls')}
						value={namespace}
						onChange={(newNamespace) =>
							setAttributes({
								interacitivtySettings: {
									...interacitivtySettings,
									targetNamespace: newNamespace
								}
							})
						}
						help={__(
							"The namespace serves as a unique identifier for this blocks interactivity context, ensuring that interactions are confined within the scope of this block to it's parent.",
							'atomic-interactivity-controls'
						)}
					/>
				)}
				<ExternalLink href="https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/api-reference/">
					API documentation
				</ExternalLink>
			</PanelBody>
		</InspectorControls>
	);
}
