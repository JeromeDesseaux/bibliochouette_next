import styles from './styles.module.css';

const NavigationMenu = ({ children }: { children: React.ReactNode }) => {
    return (
        <nav className={styles.menu}>
            {children}
        </nav>
    );
}

const LogoContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={styles.logo_container}>
            {children}
        </div>
    );
}

const LinkWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <ul className={styles.links_wrapper}>
            {children}
        </ul>
    );
}

export {
    NavigationMenu,
    LogoContainer,
    LinkWrapper
}

