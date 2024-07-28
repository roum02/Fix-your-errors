import styles from "./page.module.css";
import MainPage from './(main)/page'
import OfflinePage from "./offline/page";

export default function Home() {

  return (
 <main>
     <MainPage/>
     <OfflinePage/>
 </main>
  );
}
