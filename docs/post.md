<!-- wp:paragraph -->
<p>The recently launched WordPress Interactivity API is an amazingly flexible addition to the WordPress developer’s toolbox. It offers a first-class API for crafting reactive front-end experiences. If this is your first exposure to the Interactivity API, check out the First look from April. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>At the Pew Research Center we have been an early adopter of the Interactivity API in our block-first platform. With this new API we have created a suite of interactive blocks that power things like newsletter sign ups, user account signup's and login's, digital media rights authorization and download, and countless others. This has been possible thanks to our efforts to scale the api across many blocks in a concept we're calling "Atomic Interactive Blocks". The concept is actually pretty simple to grasp, and implement but extremely powerful in use. </p>
<!-- /wp:paragraph -->

<!-- wp:embed {"url":"https://developer.wordpress.org/news/2024/04/11/a-first-look-at-the-interactivity-api/","type":"wp-embed","providerNameSlug":"wordpress-developer-blog"} -->
<figure class="wp-block-embed is-type-wp-embed is-provider-wordpress-developer-blog wp-block-embed-wordpress-developer-blog"><div class="wp-block-embed__wrapper">
https://developer.wordpress.org/news/2024/04/11/a-first-look-at-the-interactivity-api/
</div></figure>
<!-- /wp:embed -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Current Interactivity Inheritance</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The Interactivity API allows child blocks or inner blocks to inherit the interactivity of their parent. This enables modifying existing functionality or data, or adding new functionality on top of existing blocks. Alternatively, a child block can have its own interactivity, independent of any higher-level block's interactivity. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><br>For example, Block A can have a store. Let's call it `example/block-a`. It can also have a method, called `onButtonClick`. Block B can be nested within Block A, and it can use the `onButtonClick` action directly in its HTML like so:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>render.php</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>data-wp-interactive=”example/block-a”

data-wp-on--click=”actions.onClick”</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Or, Block B can have it’s own store and can call this directive itself in two methods:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>render.php</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>data-wp-interactive=”example/block-b”

data-wp-on--click=”example/block-a::actions.onClick”</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Or:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>render.php</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>data-wp-interactive=”example/block-b”</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p><strong>view.js</strong></p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>store(‘example/block-b’, {
   actions:{
      onClick: () => {
          const targetStore = store(‘example/block-a’);
          targetStore.actions.onClick();
      }
   }
}</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Each of these methods has its own use cases, but they all present a problem. Block B is always, forever, stuck getting interactivity from Block A. What if Block B could receive interactivity atomically? Imagine if it could do this from any parent block you specify. Block B could then be used elsewhere in other blocks, in a myriad of ways. That's where Atomic Interactive Blocks come into play. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>In this blog post, we'll go through the steps of how to enable this atomic interaction between blocks by defining the necessary attributes globally, the user interface controls, and the two methods you can use to create dynamic interactive applications: "target namespace" and "subsumption"</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Target Namespace and Subsumption</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Before we begin registering attributes and controls, let's explain the two concepts you'll be creating for:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Target Namespace: Enables you to specify in the editor which interactive store a block should use given its target namespace.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Subsumption: Effectively, this is a mode switch for blocks. It acts as a flag for your interactive blocks. When enabled this would modify a block's markup to be ready for inclusion in a wp-each template. This is useful when using interactive blocks as user interface components in templates.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Registering Attributes</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The first step is registering our <code>targetNamespace</code>, and <code>subsumption</code> attributes. To keep things tidy we'll store these as an object under an <code>interactivitySettings</code>. We need to define this in two places. Once for the client side for editor usage, and then on the server side for frontend usage.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">Client Side</h4>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>addFilter(
	'blocks.registerBlockType',
	`atomic-interactivity-api-supports`,
	(settings) => {
		if (settings?.supports?.interactivity) {
			settings.attributes = {
				...settings.attributes,
				interactivitySettings: {
					type: 'object',
					default: {
						subsumption: false,
						targetNamespace: '',
					},
				},
			};
			settings.usesContext = &#91;
				...settings.usesContext,
				'interactivitySettings',
			];
		}
		return settings;
	},
	100
);</code></pre>
<!-- /wp:code -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Server Side</h3>
<!-- /wp:heading -->

<!-- wp:code -->
<pre class="wp-block-code"><code>&lt;?php
/**
* Register additional attributes for the core-group block
* @hook block_type_metadata 100, 1
* @param mixed $metadata
* @return mixed
*/
function add_attributes( $metadata ) {
	if ( true !== $metadata&#91;'supports']&#91;'interactivity'] ) {
		return $metadata;
	}
	if ( ! array_key_exists( 'interactivitySettings', $metadata&#91;'attributes'] ) ) {
		$metadata&#91;'attributes']&#91;'interactivitySettings'] = array(
			'type'    => 'object',
			'default' => &#91;
				'subsumption' => false,
				'targetNamespace' => ''
			]
		);
	}
	return $metadata;
}
add_filter( 'block_type_metadata', 'add_atomic_interactive_attributes' );</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Now, every block that supports interactivity will have an attribute called <code>interactivitySettings</code> that has two properties: a string called <code>targetNamespace</code> and a boolean called <code>subsumption</code>. We have also extended this new attribute to block context so that any blocks inside a given interactive block can dynamically get information like the target namespace.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Now let's add some user interface controls to control these values. </p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Registering User Interface Controls</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The next step is adding some controls to all blocks that support interactivity. We can do that like so:</p>
<!-- /wp:paragraph -->

<!-- wp:code -->
<pre class="wp-block-code"><code>/**
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
					&#91;name]
				);

				// If our block does not support interactivity, and if it's not currently selected
				// then we'll return the &lt;BlockEdit/> component unchanged. 
				if (!supportsInteractivity || !isSelected) {
					return &lt;BlockEdit {...props} />;
				}

				return (
					&lt;Fragment>
						&lt;BlockEdit {...props} />
						&lt;Controls
							{...{
								attributes,
								setAttributes,
								clientId,
								context,
							}}
						/>
					&lt;/Fragment>
				);
			},
		'with-atomic-interactivity-controls'
	),
	100
);</code></pre>
<!-- /wp:code -->

<!-- wp:paragraph -->
<p>Here we've added some simple controls to define whether a block should use subsumption or a target namespace. If a block is nested its children will receive the namespace. </p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Putting It All Together</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Now that we have our custom attributes defined and our controls now we can start making atomic interactive blocks. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Let's make a very simple example to demonstrate this concept. </p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We're going to make 3 blocks. Block A is our shared atomic interface element, for simplicity sake this will be a simple button. Block B will use Block A in Target Namespace mode. Block C will use Block A multiple times in Subsumption mode.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Block A</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Example shared element TK...</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Block B</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Example target namespace TK...</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Block C</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Example subsumption TK...</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->