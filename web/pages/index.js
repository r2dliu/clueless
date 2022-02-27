import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Test from "@/components/Test";

export default function Home() {
  return (
    <div className={styles.container}>
      <Test />
    </div>
  )
}
