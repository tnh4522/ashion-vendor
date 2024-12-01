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
        model: 'permission',
        actions: [
            { key: 'permission:create', name: 'create', description: 'The user is allowed to create a new permission.' },
            { key: 'permission:read', name: 'read', description: 'The user is allowed to read permission details.' },
            { key: 'permission:update', name: 'update', description: 'The user is allowed to update permission details.' },
            { key: 'permission:delete', name: 'delete', description: 'The user is allowed to delete a permission.' }
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
    }
];

export default dataPermission;
