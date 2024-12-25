// permissions.js

/**
 * Kiểm tra xem user có quyền cụ thể hay không.
 * @param {Array} userScopes - Danh sách các quyền của người dùng.
 * @param {String} requiredScope - Quyền cần kiểm tra.
 * @returns {Boolean}
 */
export const hasPermission = (userScopes, requiredScope) => {
    return userScopes.includes(requiredScope);
};

/**
 * Kiểm tra xem user có ít nhất một trong các quyền được yêu cầu hay không.
 * @param {Array} userScopes - Danh sách các quyền của người dùng.
 * @param {Array} requiredScopes - Danh sách các quyền cần kiểm tra.
 * @returns {Boolean}
 */
export const hasAnyPermission = (userScopes, requiredScopes) => {
    return requiredScopes.some(scope => userScopes.includes(scope));
};

/**
 * Kiểm tra xem user có tất cả các quyền được yêu cầu hay không.
 * @param {Array} userScopes - Danh sách các quyền của người dùng.
 * @param {Array} requiredScopes - Danh sách các quyền cần kiểm tra.
 * @returns {Boolean}
 */
export const hasAllPermissions = (userScopes, requiredScopes) => {
    return requiredScopes.every(scope => userScopes.includes(scope));
};
