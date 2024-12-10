import removeAccents from 'remove-accents';

export const convertUrl = (url) => {
    return url.replace("/media/", "/api/media/");
}

export const convertToSlug = (str) => {
    return removeAccents(str).toLowerCase().replace(/\s+/g, '-');
};

