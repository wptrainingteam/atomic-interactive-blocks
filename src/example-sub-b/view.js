/**
 * WordPress Dependencies
 */
import { store, getContext, getElement, getServerState, getServerContext } from '@wordpress/interactivity';

const { state, actions } = store('wp-dev-blog/example-b', {
    actions: {
        onClick: () => {
            const context = getContext();
            const { targetNamespace } = context;
            const targetStore = store(targetNamespace);
            const { actions: targetActions, state: targetState } = targetStore;
            targetState.content = 'Hello from example-b';
            context.emoji = targetActions?.higherAuthorityGetValue('👋');
        }
    },
    callbacks: {
        
    }
})