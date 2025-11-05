import shrimpImage from "../../images/shrimp.png";
import line from "../../images/btn_base.png";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="flex h-screen w-screen justify-center items-center bg-black/5">
        <div className="flex w-max h-max bg-white rounded-lg shadow-2xl justify-center items-center m-5 p-10 flex-col gap-5">
          <div className="flex flex-row gap-2 items-center">
            <img className="size-14" src={shrimpImage.src} alt="shrimp logo" />
            <div className="font-bold text-left leading-none text-xl">
              <div>Go</div>
              <div>Shrimp</div>
            </div>
          </div>
          <Link href="">
            <div className="flex bg-green-500 rounded-lg overflow-hidden">
              <div className="flex m-3 mx-4 flex-row items-center gap-2">
                <img src={line.src} className="w-8" />
                <span className="text-white font-bold">Log in with LINE</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
