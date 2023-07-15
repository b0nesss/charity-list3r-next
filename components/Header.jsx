import Link from "next/link";
import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="border-b-2 flex flex-row">
      <Link href={"/"}>
        <h1 className="py-4 px-4 font-bold text-3xl">CharityList3r</h1>
      </Link>
      <Link href={"/create-charity"} className="py-4 px-2 align-bottom">
        <button className="font-bold bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded">
          Register A Charity
        </button>
      </Link>
      <div className=" ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
