import configData from './module_payment.json';

/**
 * Retrieves the configuration for a specified module.
 * @param {string} moduleName - The name of the module to retrieve.
 * @returns {object} - The configuration object for the specified module.
 */
const getModuleConfig = (moduleName) => {
    const moduleConfig = configData.find(
        (module) => module.module_name.toLowerCase() === moduleName.toLowerCase()
    );

    if (!moduleConfig) {
        throw new Error(`Module configuration for "${moduleName}" not found.`);
    }

    return moduleConfig;
};

export default getModuleConfig;
