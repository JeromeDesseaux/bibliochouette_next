import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

const LandingWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.landing_wrapper}>
            {children}
        </div>
    );
}

export {
    LandingWrapper
}