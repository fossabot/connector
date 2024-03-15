const generatePageURL = (path, prefix = '', locale = '') => {
    if (process.env.URL_PREFIX_INCLUDE_LOCALE === 'true') {
        prefix = locale ? `${locale}/${prefix}` : prefix
    }

    return `${prefix ? `/${prefix}` : ''}/${path || ''}`
}

export default generatePageURL