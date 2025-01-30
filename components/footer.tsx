import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 mt-8 text-white bg-opacity-0 backdrop-blur-sm z-20">
      <div className="max-w-[2000px] mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <a
            href="mailto:contact@umi.to"
            className="underline hover:text-blue-200 transition-colors"
          >
            contact@umi.to
          </a>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/terms"
            className="underline hover:text-blue-200 transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
