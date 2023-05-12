import styles from './menu.module.css';
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
  const renderMenuItem = (menuItem: MenuItem) => {
    return (
      
          <li key={menuItem.title} className={styles.menuitem} >

            { menuItem.path ? (
              <Link className={styles.menu_links} href={menuItem.path}>
                {menuItem.title}
              </Link>
            ) : (
              <span className={styles.menu_dropdown} >
                {menuItem.title}
              </span>

            )}

            {menuItem.dropdown && (
              <ul className={styles.dropdown_menu}>
                {menuItem.dropdown.map((subMenuItem) => renderMenuItem(subMenuItem))}
              </ul>
            )}
    
          </li>);
       
    
  };

  return (
      <ul className={styles.menuitems}>
        {menuItems.map((menuItem) => renderMenuItem(menuItem))}
      </ul>
  );
};

export default Menu;
