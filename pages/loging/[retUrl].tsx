import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { config } from "../../config/constants";
import wrapper, { StoreState } from "../../redux/create-store";
import styles from "../../styles/Home.module.css";


export const getServerSideProps = wrapper.getServerSideProps(()=> {return async (ctx): Promise<any> =>{
    const retUrl = ctx.query.retUrl as string;
    return { props: { retUrl } };
};});


export default function Loging(props:{retUrl: string}): JSX.Element {
  const router = useRouter();
  const [urlOrigin, setUrlOrigin] = useState("");

  useEffect(()=>{
    setUrlOrigin(window.location.origin + "/login_callback?next_url=" + props.retUrl);
  },[props.retUrl]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Voice chat application</title>
        <meta name="description" content="this is prototype of voice chat application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      login page
      <a href={`${config.url.API_BASE_URL}/auth/google_oauth2?return_to=${encodeURIComponent(urlOrigin)}`}>ログイン</a>
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
