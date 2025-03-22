import { useSearchParams } from "next/navigation";

const useSearchParam = (name: string) => {
  const sp = useSearchParams();
  const param = sp.get(name);
  return param;
};

export default useSearchParam;
