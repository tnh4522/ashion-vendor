const RoleDefault = () => {

    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card mt-3">
                <h5 className="card-header">Default Roles and Permissions</h5>
                <div className="table-responsive text-nowrap" style={{padding: '20px'}}>
                    <table className={"table table-bordered table-hover"}>
                        <thead>
                        <tr>
                            <th>Module</th>
                            <th>Role</th>
                            <th>Permissions</th>
                            <th>Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>My Store</td>
                            <td>ADMIN</td>
                            <td>Add Stock</td>
                            <td>Default Stock is main store + address. Additional stock can be added.</td>
                        </tr>
                        <tr className='table-danger'>
                            <td>User Management</td>
                            <td>ADMIN</td>
                            <td>CRUDB</td>
                            <td>
                                Create: Email staff to fill password.<br/>
                                Read: View all info except password.<br/>
                                Update: Update all fields, including password.<br/>
                                Block: Set user status to INACTIVE.<br/>
                                Delete: Requires confirmation, permanent removal.
                            </td>
                        </tr>
                        <tr>
                            <td>Category Management</td>
                            <td>ADMIN</td>
                            <td>CRUD</td>
                            <td>
                                Default Non-Category. Delete shows warning; items move to Non-Category or archived.
                            </td>
                        </tr>
                        <tr>
                            <td>Product Management</td>
                            <td>ADMIN</td>
                            <td>CRUD</td>
                            <td>
                                Add Ref Code, unique identifier, auto-generated.<br/>
                                Add Brand field.<br/>
                                Delete: Soft delete (Archive).
                            </td>
                        </tr>
                        <tr>
                            <td>Order Management</td>
                            <td>MANAGER</td>
                            <td>RUD</td>
                            <td>Manage and update orders as necessary.</td>
                        </tr>
                        <tr>
                            <td>Customer Management</td>
                            <td>SELLER</td>
                            <td>CRU</td>
                            <td>Add Loyal Point history for customers.</td>
                        </tr>
                        <tr>
                            <td>Role Management</td>
                            <td>ADMIN</td>
                            <td>CRUD</td>
                            <td>
                                Delete: Options to replace with existing Role or link to create a new one.
                            </td>
                        </tr>
                        <tr>
                            <td>Account Settings</td>
                            <td>All Roles</td>
                            <td>Update Profile</td>
                            <td>Update personal info, password, and verify identity.</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RoleDefault;
