import { Tabs } from "antd";

const RoleDefault = () => {
  const modules = [
    {
      key: "my-store",
      label: "My Store",
      data: [
        {
          role: "ADMIN",
          permissions: "Add Stock",
          details: "- Default Stock is main store + address. Additional stock can be added.",
        },
      ],
    },
    {
      key: "user-management",
      label: "User Management",
      data: [
        {
          role: "ADMIN",
          permissions: "CRUDB",
          details: `
            - <strong>Create:</strong> Send an email for staff to set their password. Staff must log in and update their profile.<br />
            - <strong>Read:</strong> View all account details except passwords.<br />
            - <strong>Update:</strong> Update all fields, including overriding the password (Username cannot be changed).<br />
            - <strong>Block:</strong> Set the account status to INACTIVE (login disabled). The account can later be <strong>Unblocked</strong>.<br />
            - <strong>Delete:</strong> Displays a confirmation prompt before permanent deletion.
          `,
        },
        {
          role: "MANAGER",
          permissions: "R",
          details: `
            - View limited account information, including full name, username, and role.
          `,
        },
      ],
    },
    {
      key: "category-management",
      label: "Category Management",
      data: [
        {
          role: "ADMIN",
          permissions: "CRUD",
          details: `
            - <strong>Create:</strong> Create new categories to organize products.<br />
            - <strong>Read:</strong> View all categories in the system, including the default Non-Category.<br />
            - <strong>Update:</strong> Edit existing category information.<br />
            - <strong>Delete:</strong> Associated products will be moved to "Non-Category."
          `,
        },
        {
          role: "MANAGER",
          permissions: "CR",
          details: `
            - Add new categories when importing new product groups.<br />
            - View current categories to support inventory management tasks.
          `,
        },
        {
          role: "SELLER",
          permissions: "R",
          details: `
            - View product categories to support customer consultation and sales.
          `,
        },
      ],
    },
    {
      key: "product-management",
      label: "Product Management",
      data: [
        {
          role: "ADMIN",
          permissions: "CRUD",
          details: `
            - <strong>Create:</strong> Automatically generates a unique reference code (Ref Code) for each product.<br />
            - <strong>Read:</strong> View all detailed information about products.<br />
            - <strong>Update:</strong> Modify product details.<br />
            - <strong>Delete:</strong> Soft delete (Archive).
          `,
        },
        {
          role: "MANAGER",
          permissions: "CR",
          details: `
            - Add new products to categories, especially when new product groups are imported.<br />
            - View product information to support inventory management tasks.
          `,
        },
        {
          role: "SELLER",
          permissions: "R",
          details: `
            - View product information to support customer consultation and sales.
          `,
        },
        
      ],
    },
    {
        key: 'order-management',
        label: 'Order Management',
        data: [
          {
            role: 'ADMIN',
            permissions: 'R (or CRUD in certain cases)',
            details: `
              - Read: View order info if Manager or Seller is handling orders.<br />
              - CRUD: If no Manager or Seller is present, Admin can handle orders entirely.
            `,
          },
          {
            role: 'MANAGER',
            permissions: 'RUD',
            details: `
              - Read: View all order information.<br />
              - Update: Update order status .<br />
              - Delete: Remove invalid or canceled orders to ensure data accuracy.
            `,
          },
          {
            role: 'SELLER',
            permissions: 'CRU',
            details: `
              - Create: Add new orders when transacting with customers.<br />
              - Read: View orders created by the Seller.<br />
              - Update: Update status or edit orders created by the Seller.
            `,
          },
        ],
      },
      {
        key: 'customer-management',
        label: 'Customer Management',
        data: [
          {
            role: 'ADMIN',
            permissions: 'R',
            details: `
              - View all customer information and loyalty point history.
            `,
          },
          {
            role: 'MANAGER',
            permissions: 'RU',
            details: `
              - View customer list and loyalty point history.<br />
              - Update customer information, including name, address, email, and accumulated points.<br />
              - Delete invalid or inactive customer accounts.
            `,
          },
          {
            role: 'SELLER',
            permissions: 'CRU',
            details: `
              - Add new customers to the system during transactions.<br />
              - View basic customer information and loyalty point history.<br />
              - Edit information for customers under the Seller s management scope.
            `,
          },
        ],
      },
      {
        key: 'role-management',
        label: 'Role Management',
        data: [
          {
            role: 'ADMIN',
            permissions: 'CRUD',
            details: `
              Delete: Options to replace with existing Role or link to create a new one.
            `,
          },
        ],
      },
      {
        key: 'activity-tracker',
        label: 'Activity Tracker',
        data: [
          {
            role: 'ADMIN',
            permissions: 'R',
            details: `
              List all activities on a single page.
            `,
          },
        ],
      },
      {
        key: 'dashboard',
        label: 'Dashboard',
        data: [
          {
            role: 'MANAGER',
            permissions: 'R',
            details: `
              Full Manager View by day, week, month.<br />
              Various detailed views available.
            `,
          },
          {
            role: 'SELLER',
            permissions: 'R',
            details: `
              View daily sales revenue by seller account only.
            `,
          },
        ],
      },
    ];

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card mt-3">
        <h5 className="card-header">Default Roles and Permissions</h5>
        <div className="table-responsive text-nowrap" style={{ padding: "20px" }}>
        <Tabs
            defaultActiveKey="my-store"
            type="card"
            size="large"
            style={{ borderBottom: "1px solid #e8e8e8" }}
          >
            {modules.map((module) => (
              <Tabs.TabPane tab={module.label} key={module.key}>
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th className="text-center">Role</th>
                      <th className="text-center">Permissions</th>
                      <th className="text-center">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {module.data.map((row, index) => (
                      <tr key={index}>
                        <td className="text-center">{row.role}</td>
                        <td className="text-center">{row.permissions}</td>
                        <td dangerouslySetInnerHTML={{ __html: row.details }} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RoleDefault;
