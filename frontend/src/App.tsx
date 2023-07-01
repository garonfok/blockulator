import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Upload from "./components/Upload";
import Result from "./components/Result";

function App() {
  const [blockMatrix, setBlockMatrix] = useState<
    { name: string; image: string }[][]
  >([]);

  return (
    <div className="flex flex-col w-screen text-slate-800">
      <Header />
      <div className="flex flex-col flex-auto w-[48rem] self-center py-8">
        {blockMatrix.length > 0 ? (
          <Result blockMatrix={blockMatrix} />
        ) : (
          <Upload setBlockMatrix={setBlockMatrix} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
