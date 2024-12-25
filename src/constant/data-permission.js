const dataPermission = [
    {
        model: 'dashboard',
        actions: [
            { key: 'dashboard:read', name: 'read', description: 'The user is allowed to view the dashboard.' }
        ]
    },
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
        model: 'product',
        actions: [
            { key: 'product:create', name: 'create', description: 'The user is allowed to create a new product.' },
            { key: 'product:read', name: 'read', description: 'The user is allowed to read product details.' },
            { key: 'product:update', name: 'update', description: 'The user is allowed to update product details.' },
            { key: 'product:delete', name: 'delete', description: 'The user is allowed to delete a product.' }
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
        model: 'transaction',
        actions: [
            { key: 'transaction:read', name: 'read', description: 'The user is allowed to view their transactions.' }
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
        model: 'activity_log',
        actions: [
            { key: 'activity_log:read', name: 'read', description: 'The user is allowed to view activity logs.' }
        ]
    }
];

export default dataPermission;
