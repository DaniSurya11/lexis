import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-brand-blue/5 py-3 mt-auto">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 group">
            <Image 
              src="/logo-icon.svg"
              alt="Lexis Icon"
              width={16}
              height={16}
              className="h-4 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-black tracking-tighter text-brand-blue opacity-50 group-hover:opacity-100">
                LEXIS
              </span>
              <span className="text-[5.5px] font-black tracking-[0.15em] text-brand-blue uppercase opacity-40 group-hover:opacity-100">
                Premium
              </span>
            </div>
          </Link>
          <p className="text-[10px] text-on-surface-variant opacity-40 font-medium">
            © {new Date().getFullYear()} Lexis Premium Tech Center
          </p>
        </div>
        <div className="flex gap-5">
          <Link className="text-[10px] text-on-surface-variant opacity-40 font-medium hover:text-primary hover:opacity-100 transition-all" href="/privacy">Privasi</Link>
          <Link className="text-[10px] text-on-surface-variant opacity-40 font-medium hover:text-primary hover:opacity-100 transition-all" href="/terms">Syarat</Link>
          <Link className="text-[10px] text-on-surface-variant opacity-40 font-medium hover:text-primary hover:opacity-100 transition-all" href="/support">Bantuan</Link>
        </div>
      </div>
    </footer>
  );
}
