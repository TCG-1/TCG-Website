import Image from "next/image";
import Link from "next/link";

type AuthorBioProps = {
  name: string;
};

type AuthorProfile = {
  role: string;
  bio: string;
  image: string;
  credibilityLink?: {
    href: string;
    label: string;
  };
};

const AUTHOR_DATA: Record<string, AuthorProfile> = {
  "Audrey Nyamande": {
    role: "Founder, Tacklers Consulting Group",
    bio: "Audrey is a Lean Six Sigma certified aerospace engineer and transformation coach. She has led improvement programmes in high-stakes engineering, manufacturing, and MRO environments across the UK, helping organisations reduce waste, protect expertise, and build capability that lasts.",
    image: "/media/Audrey-Nyamande-1-cd36ad87.jpeg",
    credibilityLink: {
      href: "https://www.globalleansummit.com/2026_speakers/",
      label: "View speaker profile: Global Lean Summit 2026",
    },
  },
};

const DEFAULT_AUTHOR = {
  role: "Tacklers Consulting Group",
  bio: "Practical perspectives on Lean transformation, operational excellence, and continuous improvement from the team at Tacklers Consulting Group.",
  image: "/media/TCG%20Logo.png",
};

export function AuthorBio({ name }: AuthorBioProps) {
  const author = AUTHOR_DATA[name] ?? DEFAULT_AUTHOR;

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-[#8a0917]/10 bg-slate-50 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
      <div className="flex-shrink-0">
        <Image
          src={author.image}
          alt={name}
          width={80}
          height={80}
          className="h-20 w-20 rounded-full object-cover grayscale-[0.08]"
        />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#795900]">About the author</p>
        <p className="mt-2 text-lg font-semibold text-slate-950">{name}</p>
        <p className="text-sm font-medium text-[#8a0917]">{author.role}</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">{author.bio}</p>
        {author.credibilityLink ? (
          <a
            href={author.credibilityLink.href}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex text-sm font-semibold text-[#8a0917] underline decoration-[#8a0917]/30 underline-offset-4 hover:decoration-[#8a0917]"
          >
            {author.credibilityLink.label}
          </a>
        ) : null}
        <Link
          href="/about"
          className="mt-4 inline-flex text-sm font-semibold text-[#8a0917] underline decoration-[#8a0917]/30 underline-offset-4 hover:decoration-[#8a0917]"
        >
          Learn more about our team
        </Link>
      </div>
    </div>
  );
}
