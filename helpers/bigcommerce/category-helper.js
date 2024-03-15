const getCategoryFullName = (categoryId, categories) => {
    let category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';

    let fullName = category.name;
    while (category.parent_id) {
        category = categories.find(cat => cat.id === category.parent_id);
        if (category) fullName = category.name + ' / ' + fullName;
    }

    return fullName;
}

function findChildren(categories, parentId) {
    return categories.filter(cat => cat.parent_id === parentId);
}

function findParents(categories, childId) {
    let parents = [];
    let currentParentId = categories.find(cat => cat.id === childId)?.parent_id;
    
    while (currentParentId) {
        const parent = categories.find(cat => cat.id === currentParentId);
        if (parent) {
            parents.push(parent);
            currentParentId = parent.parent_id;
        } else {
            break;
        }
    }

    return parents;
}

export {
    getCategoryFullName,
    findChildren,
    findParents,
}