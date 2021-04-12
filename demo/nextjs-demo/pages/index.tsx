import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Wallet } from '../../../lib'

export default function Home() {
  const onConnect = async () => {
    // @ts-ignore

    const wallet = new Wallet({ isWeb: true});

    const addresses = await window.ethereum.enable();
    const address = addresses[0];
    
    // Password 12 characters or more
    const passphrase = 'qwerty123456';
    const accountName = 'molekilla';
    
    // Create DB
    await wallet.open(accountName, passphrase)

    // Add collection ?
    await wallet.enrollAccount({
      passphrase,
      accountName,
    });
    
    let did = await wallet.getDIDAccountFromWeb3Address(address);
    if(!did) {
      did = await wallet.create3ID(address);
    }
    
    console.log(did);

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={onConnect}>Connect</button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
