import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { config } from "../config/constants";
import styles from "../styles/Home.module.css";

export default function Loging() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Voice chat application</title>
        <meta name="description" content="this is prototype of voice chat application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        login page
      <a href="http://myapp.test.com/auth/google_oauth2">ログイン</a>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
