import Game from "@/components/game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Srikanthan's Journey</h1>
      <div className="w-full max-w-4xl">
        <Game />
      </div>
      <p className="text-gray-400 mt-4 text-center">
        Use arrow keys to move. Press space to jump. Click on signboards to learn more.
      </p>
    </main>
  )
}

