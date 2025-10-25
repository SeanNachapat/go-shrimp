export default function Home() {
  return (
    <div className="">
      <div className="text-2xl font-bold mx-6">Hello, User!</div>
      <div className="flex flex-row my-3 mx-6 gap-3">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-white shadow-lg p-5"></div>
          <div className="rounded-2xl bg-white shadow-lg p-5"></div>
        </div>
        <div className="rounded-2xl bg-white shadow-lg p-5">
          <span className="text-lg font-bold">🦐 ราคากุ้ง</span>
        </div>
      </div>
    </div>
  );
}
