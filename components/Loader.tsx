import Image from "next/image";

const Loader = () => {
  return (
    <div className="loader">
      <Image
        src="/assets/icons/loader.svg"
        alt="Loading..."
        width={32}
        height={32}
        className="animated-spin"
      />
      Cargando...
    </div>
  );
};

export default Loader;
