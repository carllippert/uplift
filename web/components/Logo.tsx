import Image from "next/image";
import salto from "../images/salto.svg";

const Logo = () => {
  return (
    <div className="flex-1">
      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-pink-400">
        {/* <Image src={salto} /> */}
        Salto
      </div>
    </div>
  );
};

export default Logo;
