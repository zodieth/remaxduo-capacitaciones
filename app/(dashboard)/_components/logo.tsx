import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={"/dashboard"}>
      <Image
        height={130}
        width={130}
        alt="logo"
        src="/logoup.png"
      />
    </Link>
  );
};
