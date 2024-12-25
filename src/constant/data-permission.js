const dataPermission = [
    {
        model: 'user',
        actions: [
            { key: 'user:create', name: 'create', description: 'The user is allowed to create a new user.' },
            { key: 'user:read', name: 'read', description: 'The user is allowed to read user details.' },
            { key: 'user:update', name: 'update', description: 'The user is allowed to update user details.' },
            { key: 'user:delete', name: 'delete', description: 'The user is allowed to delete a user.' }
        ]
    },
    {
        model: 'role',
        actions: [
            { key: 'role:create', name: 'create', description: 'The user is allowed to create a new role.' },
            { key: 'role:read', name: 'read', description: 'The user is allowed to read role details.' },
            { key: 'role:update', name: 'update', description: 'The user is allowed to update role details.' },
            { key: 'role:delete', name: 'delete', description: 'The user is allowed to delete a role.' }
        ]
    },
    {
        model: 'role_permission',
        actions: [
            { key: 'role_permission:assign', name: 'assign', description: 'The user is allowed to assign permissions to roles.' },
            { key: 'role_permission:read', name: 'read', description: 'The user is allowed to read role-permission assignments.' },
            { key: 'role_permission:revoke', name: 'revoke', description: 'The user is allowed to revoke permissions from roles.' }
        ]
    },
    {
        model: 'user_permission',
        actions: [
            { key: 'user_permission:assign', name: 'assign', description: 'The user is allowed to assign permissions to users.' },
            { key: 'user_permission:read', name: 'read', description: 'The user is allowed to read user-permission assignments.' },
            { key: 'user_permission:revoke', name: 'revoke', description: 'The user is allowed to revoke permissions from users.' }
        ]
    },
    {
        model: 'address',
        actions: [
            { key: 'address:create', name: 'create', description: 'The user is allowed to create a new address.' },
            { key: 'address:read', name: 'read', description: 'The user is allowed to read address details.' },
            { key: 'address:update', name: 'update', description: 'The user is allowed to update address details.' },
            { key: 'address:delete', name: 'delete', description: 'The user is allowed to delete an address.' }
        ]
    },
    {
        model: 'category',
        actions: [
            { key: 'category:create', name: 'create', description: 'The user is allowed to create a new category.' },
            { key: 'category:read', name: 'read', description: 'The user is allowed to read category details.' },
            { key: 'category:update', name: 'update', description: 'The user is allowed to update category details.' },
            { key: 'category:delete', name: 'delete', description: 'The user is allowed to delete a category.' }
        ]
    },
    {
        model: 'tag',
        actions: [
            { key: 'tag:create', name: 'create', description: 'The user is allowed to create a new tag.' },
            { key: 'tag:read', name: 'read', description: 'The user is allowed to read tag details.' },
            { key: 'tag:update', name: 'update', description: 'The user is allowed to update tag details.' },
            { key: 'tag:delete', name: 'delete', description: 'The user is allowed to delete a tag.' }
        ]
    },
    {
        model: 'product',
        actions: [
            { key: 'product:create', name: 'create', description: 'The user is allowed to create a new product.' },
            { key: 'product:read', name: 'read', description: 'The user is allowed to read product details.' },
            { key: 'product:update', name: 'update', description: 'The user is allowed to update product details.' },
            { key: 'product:delete', name: 'delete', description: 'The user is allowed to delete a product.' }
        ]
    },
    {
        model: 'product_image',
        actions: [
            { key: 'product_image:upload', name: 'upload', description: 'The user is allowed to upload a new product image.' },
            { key: 'product_image:read', name: 'read', description: 'The user is allowed to view product images.' },
            { key: 'product_image:update', name: 'update', description: 'The user is allowed to update product image details.' },
            { key: 'product_image:delete', name: 'delete', description: 'The user is allowed to delete a product image.' }
        ]
    },
    {
        model: 'cart',
        actions: [
            { key: 'cart:read', name: 'read', description: 'The user is allowed to view their cart.' },
            { key: 'cart:update', name: 'update', description: 'The user is allowed to update their cart.' },
            { key: 'cart:delete', name: 'delete', description: 'The user is allowed to clear their cart.' }
        ]
    },
    {
        model: 'cart_item',
        actions: [
            { key: 'cart_item:add', name: 'add', description: 'The user is allowed to add items to their cart.' },
            { key: 'cart_item:read', name: 'read', description: 'The user is allowed to view items in their cart.' },
            { key: 'cart_item:update', name: 'update', description: 'The user is allowed to update quantities of items in their cart.' },
            { key: 'cart_item:delete', name: 'delete', description: 'The user is allowed to remove items from their cart.' }
        ]
    },
    {
        model: 'wishlist',
        actions: [
            { key: 'wishlist:read', name: 'read', description: 'The user is allowed to view their wishlist.' }
        ]
    },
    {
        model: 'wishlist_item',
        actions: [
            { key: 'wishlist_item:add', name: 'add', description: 'The user is allowed to add items to their wishlist.' },
            { key: 'wishlist_item:read', name: 'read', description: 'The user is allowed to view items in their wishlist.' },
            { key: 'wishlist_item:delete', name: 'delete', description: 'The user is allowed to remove items from their wishlist.' }
        ]
    },
    {
        model: 'order',
        actions: [
            { key: 'order:create', name: 'create', description: 'The user is allowed to place a new order.' },
            { key: 'order:read', name: 'read', description: 'The user is allowed to view their orders.' },
            { key: 'order:update', name: 'update', description: 'The user is allowed to update order details.' },
            { key: 'order:cancel', name: 'cancel', description: 'The user is allowed to cancel their order.' }
        ]
    },
    {
        model: 'order_item',
        actions: [
            { key: 'order_item:read', name: 'read', description: 'The user is allowed to view items in their order.' }
        ]
    },
    {
        model: 'review',
        actions: [
            { key: 'review:create', name: 'create', description: 'The user is allowed to write a review.' },
            { key: 'review:read', name: 'read', description: 'The user is allowed to read reviews.' },
            { key: 'review:update', name: 'update', description: 'The user is allowed to update their own reviews.' },
            { key: 'review:delete', name: 'delete', description: 'The user is allowed to delete their own reviews.' }
        ]
    },
    {
        model: 'coupon',
        actions: [
            { key: 'coupon:create', name: 'create', description: 'The user is allowed to create a new coupon.' },
            { key: 'coupon:read', name: 'read', description: 'The user is allowed to view coupon details.' },
            { key: 'coupon:update', name: 'update', description: 'The user is allowed to update coupon details.' },
            { key: 'coupon:delete', name: 'delete', description: 'The user is allowed to delete a coupon.' }
        ]
    },
    {
        model: 'loyalty_point',
        actions: [
            { key: 'loyalty_point:read', name: 'read', description: 'The user is allowed to view their loyalty points.' }
        ]
    },
    {
        model: 'transaction',
        actions: [
            { key: 'transaction:read', name: 'read', description: 'The user is allowed to view their transactions.' }
        ]
    },
    {
        model: 'message_thread',
        actions: [
            { key: 'message_thread:read', name: 'read', description: 'The user is allowed to view message threads.' },
            { key: 'message_thread:delete', name: 'delete', description: 'The user is allowed to delete message threads.' }
        ]
    },
    {
        model: 'message',
        actions: [
            { key: 'message:send', name: 'send', description: 'The user is allowed to send messages.' },
            { key: 'message:read', name: 'read', description: 'The user is allowed to read messages.' },
            { key: 'message:delete', name: 'delete', description: 'The user is allowed to delete messages.' }
        ]
    },
    {
        model: 'promotion',
        actions: [
            { key: 'promotion:create', name: 'create', description: 'The user is allowed to create a new promotion.' },
            { key: 'promotion:read', name: 'read', description: 'The user is allowed to view promotions.' },
            { key: 'promotion:update', name: 'update', description: 'The user is allowed to update promotion details.' },
            { key: 'promotion:delete', name: 'delete', description: 'The user is allowed to delete a promotion.' }
        ]
    },
    {
        model: 'notification',
        actions: [
            { key: 'notification:read', name: 'read', description: 'The user is allowed to read notifications.' },
            { key: 'notification:delete', name: 'delete', description: 'The user is allowed to delete notifications.' }
        ]
    },
    {
        model: 'return_request',
        actions: [
            { key: 'return_request:create', name: 'create', description: 'The user is allowed to initiate a return request.' },
            { key: 'return_request:read', name: 'read', description: 'The user is allowed to view their return requests.' }
        ]
    },
    {
        model: 'shipping_method',
        actions: [
            { key: 'shipping_method:create', name: 'create', description: 'The user is allowed to create a new shipping method.' },
            { key: 'shipping_method:read', name: 'read', description: 'The user is allowed to view shipping methods.' },
            { key: 'shipping_method:update', name: 'update', description: 'The user is allowed to update shipping method details.' },
            { key: 'shipping_method:delete', name: 'delete', description: 'The user is allowed to delete a shipping method.' }
        ]
    },
    {
        model: 'payment_method',
        actions: [
            { key: 'payment_method:add', name: 'add', description: 'The user is allowed to add a new payment method.' },
            { key: 'payment_method:read', name: 'read', description: 'The user is allowed to view their payment methods.' },
            { key: 'payment_method:update', name: 'update', description: 'The user is allowed to update their payment methods.' },
            { key: 'payment_method:delete', name: 'delete', description: 'The user is allowed to delete a payment method.' }
        ]
    },
    {
        model: 'seller_profile',
        actions: [
            { key: 'seller_profile:create', name: 'create', description: 'The user is allowed to create a seller profile.' },
            { key: 'seller_profile:read', name: 'read', description: 'The user is allowed to view seller profiles.' },
            { key: 'seller_profile:update', name: 'update', description: 'The user is allowed to update seller profile details.' },
            { key: 'seller_profile:delete', name: 'delete', description: 'The user is allowed to delete a seller profile.' }
        ]
    },
    {
        model: 'activity_log',
        actions: [
            { key: 'activity_log:read', name: 'read', description: 'The user is allowed to view activity logs.' }
        ]
    }
];

export default dataPermission;
