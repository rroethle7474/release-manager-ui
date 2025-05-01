import styles from './right-sidebar.module.css';

export default function RightSidebar() {
    return (
        <aside className={styles['sidebar-right']}>
            <h3>Right Sidebar</h3>
            <p>Additional content, ads, or related information can go here.</p>
        </aside>
    )
}