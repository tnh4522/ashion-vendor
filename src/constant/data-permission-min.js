const dataPermissionMin = [
    {
        model: 'user',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to read their own user details.'
            }
        ]
    },
    {
        model: 'cart',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to view their cart.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update their cart.'
            }
        ]
    },
    {
        model: 'cart_item',
        action: [
            {
                name: 'add',
                description: 'The user is allowed to add items to their cart.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view items in their cart.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update quantities of items in their cart.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to remove items from their cart.'
            }
        ]
    },
    {
        model: 'wishlist',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to view their wishlist.'
            }
        ]
    },
    {
        model: 'wishlist_item',
        action: [
            {
                name: 'add',
                description: 'The user is allowed to add items to their wishlist.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view items in their wishlist.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to remove items from their wishlist.'
            }
        ]
    },
    {
        model: 'order',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to place a new order.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view their orders.'
            },
            {
                name: 'cancel',
                description: 'The user is allowed to cancel their order.'
            }
        ]
    },
    {
        model: 'order_item',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to view items in their order.'
            }
        ]
    },
    {
        model: 'review',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to write a review.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read reviews.'
            }
        ]
    },
    {
        model: 'notification',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to read notifications.'
            }
        ]
    },
    {
        model: 'transaction',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to view their transactions.'
            }
        ]
    }
];
export default dataPermissionMin;
