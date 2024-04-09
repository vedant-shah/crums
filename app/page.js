import Link from "next/link";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-[1fr_600px]">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Welcome to XYZ Restaurant
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The only app you need to order delicious food and drinks.
              </p>
            </div>
            <img
              alt="Image"
              className="object-cover object-center mx-auto overflow-hidden aspect-video rounded-xl"
              height="350"
              src="https://en.idei.club/uploads/posts/2023-06/1687297850_en-idei-club-p-minimal-restaurant-dizain-pinterest-7.jpg"
              width="600"
            />
          </div>
        </section>
        <section className="w-full py-12 bg-gray-100 md:py-24 lg:py-32 dark:bg-gray-950">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-[1fr_600px] lg:gap-12">
            <img
              alt="Image"
              className="object-cover object-center mx-auto overflow-hidden aspect-video rounded-xl"
              height="350"
              src="https://media.istockphoto.com/id/1339827087/photo/close-up-on-a-man-scanning-a-qr-code-at-a-restaurant.jpg?s=612x612&w=0&k=20&c=M96p9xNFnw8Nck5NcJhZgwxYfFRqDItjxyr5Vvb79PA="
              width="600"
            />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Scan. Order. Enjoy.
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Scan the QR code on your table, order your favorite dishes, and
                we'll take care of the rest.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 h-[50vh]">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-[1fr_600px] lg:gap-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Table. Your Menu.
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Browse our menu, order your favorite dishes, and we'll deliver
                them to your table.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-[1fr_600px] lg:gap-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                The CRUMS Experience
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Experience the best of Acme. Order from our app and enjoy
                exclusive offers.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-center w-full gap-2 px-4 py-6 border-t sm:flex-row shrink-0 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 CRUMS. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
