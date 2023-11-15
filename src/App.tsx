import styles from './App.module.scss';
import Header from '@/components/Header';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className={styles.layout}>
      <Sidebar className={styles.sidebar} />
      <Header className={styles.header} />
      <main className={styles.main}></main>
    </div>
  );
}
