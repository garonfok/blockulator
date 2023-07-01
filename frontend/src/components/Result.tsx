import { useState } from "react";

const Result = (props: {
  blockMatrix: {
    image: string;
    name: string;
  }[][];
}) => {
  const { blockMatrix } = props;

  const [hoverBlock, setHoverBlock] = useState<string>();

  const requiredMaterials = blockMatrix
    .flat()
    .filter((block) => block.image)
    .map((block) => block.name);

  const stackedMaterials = requiredMaterials.reduce((acc, material) => {
    if (acc[material]) {
      acc[material]++;
    } else {
      acc[material] = 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const formatCount = (count: number) => {
    const shulkers = Math.floor(count / 1728);
    const stacks = Math.floor((count % 1728) / 64);
    const items = count % 64;

    const shulkerLine = shulkers > 0 ? `${shulkers} shulker(s)` : "";
    const stackLine = stacks > 0 ? `${stacks} stack(s)` : "";
    const itemLine = items > 0 ? `${items} item(s)` : "";

    return [shulkerLine, stackLine, itemLine].filter((line) => line).join(", ");
  };

  const formatName = (name: string) => {
    // replace underscores with spaces
    // capitalize first letter of each word

    const words = name.split("_");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-sky-200 rounded-lg p-2 flex justify-center">
        {/* Render the block matrix by using every image string, decoded into its png form, with the name as the alt */}
        <div
          className={`grid w-fit`}
          style={{
            gridTemplateColumns: `repeat(${blockMatrix[0].length}, 1fr)`,
          }}
        >
          {blockMatrix.map((row, rowIndex) =>
            row.map((block, colIndex) =>
              block.image ? (
                <img
                  key={`${rowIndex}_${colIndex}`}
                  src={`data:image/png;base64,${block.image}`}
                  alt={block.name}
                  onMouseOver={() =>
                    setHoverBlock(
                      `Row ${rowIndex}, Col ${colIndex}: ${formatName(block.name)}`
                    )
                  }
                  onMouseOut={() => setHoverBlock(undefined)}
                />
              ) : (
                <div></div>
              )
            )
          )}
        </div>
      </div>
      {hoverBlock && (
        <div className="absolute bg-sky-200 rounded-lg p-2 flex justify-center">
          <p>{hoverBlock}</p>
        </div>
      )}
      <ol>
        {Object.entries(stackedMaterials).map(([material, count]) => (
          <li key={material} className="flex gap-2">
            <span className="w-64">{formatName(material)}:</span>
            <span className="font-bold">{formatCount(count)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Result;
