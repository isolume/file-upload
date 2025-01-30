import FileUpload from "@/components/file-upload"
import Wave from "@/components/wave"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-400 to-blue-600 relative overflow-hidden">
      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            海 .ト
          </h1>
          <FileUpload />
        </div>
      </main>
      <Footer />
      <Wave
        className="absolute bottom-0 left-0 w-full opacity-30"
        speed={0.02}
        amplitude={25}
        wavelength={0.01}
      />
      <Wave
        className="absolute bottom-0 left-0 w-full opacity-20"
        speed={0.03}
        amplitude={20}
        wavelength={0.02}
      />
      <Wave
        className="absolute bottom-0 left-0 w-full opacity-10"
        speed={0.01}
        amplitude={15}
        wavelength={0.03}
      />
    </div>
  )
}
