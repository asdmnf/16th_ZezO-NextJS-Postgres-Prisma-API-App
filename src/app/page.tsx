import Link from "next/link";

export default function Home() {
  console.log("hello");
  return (
    <main className="text-3xl font-bold underline flex flex-col p-24">
      <h1>Hello00</h1>
      <Link href='/about' className="text-3xl font-bold underline mt-5">about</Link>
      <Link href='/articles' className="text-3xl font-bold underline mt-5">articles</Link>
    </main>
  );
}
