import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PendingPhotoContext {
  file: File | null;
  setFile: (file: File | null) => void;
  consume: () => File | null;
}

const Ctx = createContext<PendingPhotoContext>({
  file: null,
  setFile: () => {},
  consume: () => null,
});

export function PendingPhotoProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);

  const consume = useCallback(() => {
    const f = file;
    setFile(null);
    return f;
  }, [file]);

  return (
    <Ctx.Provider value={{ file, setFile, consume }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePendingPhoto() {
  return useContext(Ctx);
}
