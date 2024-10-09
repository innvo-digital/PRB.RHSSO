const storageNavigationIsOpen = 'navigation-is-open';
const selectorMenu = '.nav-menu';
const selectorNavShrink = '[data-nav-shrink]';
const selectorMenuList = '.nav-menu__list';
const selectorMenuListShrink = '.nav-menu__list--shrink';
const selectorMenuListActive = '.nav-menu__list--active';
const classMenuShrink = 'nav-menu--shrink';
const classMenuListShrink = 'nav-menu__list--shrink';
const classMenuListActive = 'nav-menu__list--active';
const classIconClosed = 'bi-chevron-left';
const classIconOpened = 'bi-chevron-right';

const navigationOpen = () => {
    $(selectorMenu).removeClass(classMenuShrink);
    $(selectorMenuListShrink).removeClass(classMenuListShrink);
    $(selectorMenuListActive).removeClass(classMenuListActive);
    $(selectorNavShrink).addClass(classIconClosed);
    $(selectorNavShrink).removeClass(classIconOpened);
};

const navigationClose = () => {
    $(selectorMenu).addClass(classMenuShrink);
    $(selectorMenuListShrink).addClass(classMenuListShrink);
    $(selectorMenuListActive).addClass(classMenuListActive);
    $(selectorNavShrink).removeClass(classIconClosed);
    $(selectorNavShrink).addClass(classIconOpened);
};

const navigationIsOpen = () => globalThis.localStorage.getItem(storageNavigationIsOpen) === 'true';

const handleLoadNavigation = () => {
    const isOpen = navigationIsOpen();
    !isOpen ? navigationClose() : navigationOpen();
}

$('[data-nav-shrink]').on('click', (e) => {
    const isOpen = navigationIsOpen()
    if (isOpen) {
        navigationClose();
        globalThis.localStorage.removeItem(storageNavigationIsOpen);
    } else {
        navigationOpen();
        if (window.innerWidth >= 920) {
            globalThis.localStorage.setItem(storageNavigationIsOpen, 'true');
        }
    }
});

$('[data-nav-sublink]').click('click', (e) => {
    const $parent = $(e.currentTarget).parent();
    $parent.toggleClass(classMenuListShrink);
    $(selectorMenuList, $parent)
        .removeClass(classMenuListActive)
        .each((i, item) => {
            setTimeout(() => $(item).addClass(classMenuListActive), i * 100);
        });
});

handleLoadNavigation();