import styles from './menu.module.css';
import { useState } from 'react';
import Link from 'next/link';

type MenuItem = {
  title: string;
  path?: string;
  dropdown?: MenuItem[];
};

type Props = {
  menuItems: MenuItem[];
};

const Menu: React.FC<Props> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const renderMenuItem = (menuItem: MenuItem) => {
    return (
      <>
        { menuItem.path && (
          <li className={styles.menuitem} key={menuItem.title} >
            <Link className={styles.menu_links} href={menuItem.path}>
              {menuItem.title}
            </Link>
          </li>
        ) }

        { !menuItem.path && (
          <li className={styles.menuitem} key={menuItem.title} onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <span>{menuItem.title}</span>
            {menuItem.dropdown && isOpen && (
              <ul className={styles.dropdown_menu}>
                {menuItem.dropdown.map((subMenuItem) => renderMenuItem(subMenuItem))}
              </ul>
          )}
        </li>)}
      </>
    );
  };

  return (
      <ul className={styles.menuitems}>
        {menuItems.map((menuItem) => renderMenuItem(menuItem))}
      </ul>
  );
};

export default Menu;
