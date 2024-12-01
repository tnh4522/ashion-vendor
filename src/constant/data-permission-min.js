const dataPermissionMin = [
    {
        model: 'user',
        actions: [
            {
                key: 'user:read',
                name: 'read',
                description: 'The user is allowed to read their own user details.'
            }
        ]
    },
    {
        model: 'cart',
        actions: [
            {
                key: 'cart:read',
                name: 'read',
                description: 'The user is allowed to view their cart.'
            },
            {
                key: 'cart:update',
                name: 'update',
                description: 'The user is allowed to update their cart.'
            }
        ]
    },
    {
        model: 'cart_item',
        actions: [
            {
                key: 'cart_item:add',
                name: 'add',
                description: 'The user is allowed to add items to their cart.'
            },
            {
                key: 'cart_item:read',
                name: 'read',
                description: 'The user is allowed to view items in their cart.'
            },
            {
                key: 'cart_item:update',
                name: 'update',
                description: 'The user is allowed to update quantities of items in their cart.'
            },
            {
                key: 'cart_item:delete',
                name: 'delete',
                description: 'The user is allowed to remove items from their cart.'
            }
        ]
    },
    {
        model: 'wishlist',
        actions: [
            {
                key: 'wishlist:read',
                name: 'read',
                description: 'The user is allowed to view their wishlist.'
            }
        ]
    },
    {
        model: 'wishlist_item',
        actions: [
            {
                key: 'wishlist_item:add',
                name: 'add',
                description: 'The user is allowed to add items to their wishlist.'
            },
            {
                key: 'wishlist_item:read',
                name: 'read',
                description: 'The user is allowed to view items in their wishlist.'
            },
            {
                key: 'wishlist_item:delete',
                name: 'delete',
                description: 'The user is allowed to remove items from their wishlist.'
            }
        ]
    },
    {
        model: 'order',
        actions: [
            {
                key: 'order:create',
                name: 'create',
                description: 'The user is allowed to place a new order.'
            },
            {
                key: 'order:read',
                name: 'read',
                description: 'The user is allowed to view their orders.'
            },
            {
                key: 'order:cancel',
                name: 'cancel',
                description: 'The user is allowed to cancel their order.'
            }
        ]
    },
    {
        model: 'order_item',
        actions: [
            {
                key: 'order_item:read',
                name: 'read',
                description: 'The user is allowed to view items in their order.'
            }
        ]
    },
    {
        model: 'review',
        actions: [
            {
                key: 'review:create',
                name: 'create',
                description: 'The user is allowed to write a review.'
            },
            {
                key: 'review:read',
                name: 'read',
                description: 'The user is allowed to read reviews.'
            }
        ]
    },
    {
        model: 'notification',
        actions: [
            {
                key: 'notification:read',
                name: 'read',
                description: 'The user is allowed to read notifications.'
            }
        ]
    },
    {
        model: 'transaction',
        actions: [
            {
                key: 'transaction:read',
                name: 'read',
                description: 'The user is allowed to view their transactions.'
            }
        ]
    }
];

export default dataPermissionMin;
