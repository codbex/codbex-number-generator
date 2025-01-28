const navigationData = {
    id: 'numbers-navigation',
    label: "Numbers",
    group: "configurations",
    order: 900,
    link: "/services/web/codbex-number-generator/gen/ui/Numbers/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
