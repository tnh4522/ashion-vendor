const dataPermission = [
    {
        model: 'user',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new user.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read user details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update user details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a user.'
            }
        ]
    },
    {
        model: 'role',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new role.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read role details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update role details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a role.'
            }
        ]
    },
    {
        model: 'permission',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new permission.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read permission details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update permission details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a permission.'
            }
        ]
    },
    {
        model: 'role_permission',
        action: [
            {
                name: 'assign',
                description: 'The user is allowed to assign permissions to roles.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read role-permission assignments.'
            },
            {
                name: 'revoke',
                description: 'The user is allowed to revoke permissions from roles.'
            }
        ]
    },
    {
        model: 'user_permission',
        action: [
            {
                name: 'assign',
                description: 'The user is allowed to assign permissions to users.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read user-permission assignments.'
            },
            {
                name: 'revoke',
                description: 'The user is allowed to revoke permissions from users.'
            }
        ]
    },
    {
        model: 'address',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new address.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read address details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update address details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete an address.'
            }
        ]
    },
    {
        model: 'category',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new category.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read category details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update category details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a category.'
            }
        ]
    },
    {
        model: 'tag',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new tag.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read tag details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update tag details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a tag.'
            }
        ]
    },
    {
        model: 'product',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new product.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read product details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update product details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a product.'
            }
        ]
    },
    {
        model: 'product_image',
        action: [
            {
                name: 'upload',
                description: 'The user is allowed to upload a new product image.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view product images.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update product image details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a product image.'
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
            },
            {
                name: 'delete',
                description: 'The user is allowed to clear their cart.'
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
                name: 'update',
                description: 'The user is allowed to update order details.'
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
            },
            {
                name: 'update',
                description: 'The user is allowed to update their own reviews.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete their own reviews.'
            }
        ]
    },
    {
        model: 'coupon',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new coupon.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view coupon details.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update coupon details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a coupon.'
            }
        ]
    },
    {
        model: 'loyalty_point',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to view their loyalty points.'
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
    },
    {
        model: 'message_thread',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to view message threads.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete message threads.'
            }
        ]
    },
    {
        model: 'message',
        action: [
            {
                name: 'send',
                description: 'The user is allowed to send messages.'
            },
            {
                name: 'read',
                description: 'The user is allowed to read messages.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete messages.'
            }
        ]
    },
    {
        model: 'promotion',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new promotion.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view promotions.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update promotion details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a promotion.'
            }
        ]
    },
    {
        model: 'notification',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to read notifications.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete notifications.'
            }
        ]
    },
    {
        model: 'return_request',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to initiate a return request.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view their return requests.'
            }
        ]
    },
    {
        model: 'shipping_method',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a new shipping method.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view shipping methods.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update shipping method details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a shipping method.'
            }
        ]
    },
    {
        model: 'payment_method',
        action: [
            {
                name: 'add',
                description: 'The user is allowed to add a new payment method.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view their payment methods.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update their payment methods.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a payment method.'
            }
        ]
    },
    {
        model: 'seller_profile',
        action: [
            {
                name: 'create',
                description: 'The user is allowed to create a seller profile.'
            },
            {
                name: 'read',
                description: 'The user is allowed to view seller profiles.'
            },
            {
                name: 'update',
                description: 'The user is allowed to update seller profile details.'
            },
            {
                name: 'delete',
                description: 'The user is allowed to delete a seller profile.'
            }
        ]
    },
    {
        model: 'activity_log',
        action: [
            {
                name: 'read',
                description: 'The user is allowed to view activity logs.'
            }
        ]
    }
];
export default dataPermission;