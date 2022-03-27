import Head from 'next/head'
import Image from 'next/image'
import Canvas from "@/components/Canvas";
import { GameContextProvider } from '@/components/helpers/GameContext';

export default function Home() {
  return (
    <GameContextProvider>
      <Canvas />
    </GameContextProvider>
  )
}
