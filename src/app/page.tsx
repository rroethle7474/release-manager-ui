import { Suspense } from "react";
import styles from "./page.module.css";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className={styles.content}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
