
export default function Loader() {
  return (
    <div className="absolute left-0 top-0 flex justify-center items-center h-full w-full backdrop-blur-sm shadow-lg rounded-md bg-surface-c overflow-hidden z-10">
      <div className="bg-primary rounded-full w-[50px] h-[50px] animate-spin" />
      <div className="bg-primary rounded-full w-[50px] h-[50px] animate-spin mx-inline" />
      <div className="bg-primary rounded-full w-[50px] h-[50px] animate-spin" />
    </div>
  );
}
