import styles from './left-sidebar.module.css';

export default function LeftSidebar() {
    return (
        <section className={styles['sidebar-left']}>
            <h3>Left Sidebar</h3>
            <p>Navigation or additional information can go here.</p>
        </section>
    )
}
