import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>TribeChat</title>
        <meta name="description" content="TribeChat Communications App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar/>
    </div>
  )
}
