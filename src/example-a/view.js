/**
 * WordPress Dependencies
 */
import { store, getContext, getElement, getServerState, getServerContext } from '@wordpress/interactivity';

const { state, actions } = store('wp-dev-blog/example-a', {
    actions: {
        higherAuthorityGetValue: (oldValue) => {
            return 'prefixed_' + oldValue;
        }
    },
    callbacks: {

    }
})