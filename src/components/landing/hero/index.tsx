import styles from './styles.module.css';

const HeroWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={styles.hero_wrapper}>{children}</div>
    );
}

export {
    HeroWrapper
}