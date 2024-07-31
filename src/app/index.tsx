import styles from "./index.module.css";
import Link from 'next/link';

export default function Home() {

  return (
      <main>
          <h1>Welcome to the Home Page</h1>
          <nav>
              <ul>
                  <li>
                      <Link href="/(main)">
                          <a>Main Page</a>
                      </Link>
                  </li>
                  <li>
                      <Link href="/offline">
                          <a>Offline Page</a>
                      </Link>
                  </li>
              </ul>
          </nav>
      </main>
  );
}
