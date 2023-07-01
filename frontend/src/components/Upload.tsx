import { IconPhoto, IconPhotoUp, IconTrash } from "@tabler/icons-react";
import classNames from "classnames";
import Slider from "rc-slider";
import { useEffect, useRef, useState } from "react";

import "rc-slider/assets/index.css";
import axios from "axios";

const url = "http://192.168.1.11:8080";
const MAX_HEIGHT = 128;

const Upload = (props: {
  setBlockMatrix: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        image: string;
      }[][]
    >
  >;
}) => {
  const { setBlockMatrix } = props;

  const [fileDragging, setFileDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [aspectRatio, setAspectRatio] = useState<number>();
  const [downsampledImageString, setDownsampledImageString] =
    useState<string>();
  const [scale, setScale] = useState(MAX_HEIGHT);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let aR;
    const initializeImage = async () => {
      if (!selectedFile) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = async () => {
          aR = image.naturalWidth / image.naturalHeight;
          setAspectRatio(aR);

          const data = {
            file: selectedFile,
            height: scale,
            width: Math.round(scale * aR),
          };

          try {
            const response = await axios({
              baseURL: url,
              url: "/api/image/downsample",
              method: "POST",
              headers: {
                "content-type": "multipart/form-data",
              },
              data,
            });

            if (response.status !== 200) {
              throw new Error("Error uploading image");
            }

            setDownsampledImageString(
              `data:image/png;base64,${response.data.data}`
            );
          } catch (e) {
            console.error("An error occurred: ", e);
          }
        };
        image.src = event.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
    };

    initializeImage();
  }, [selectedFile, scale]);

  const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFileDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFileDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    setSelectedFile(file);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    setSelectedFile(undefined);
    setDownsampledImageString(undefined);
    setAspectRatio(undefined);
  };

  const generateBlocks = async () => {
    setLoading(true);
    const data = {
      file: selectedFile,
      height: scale,
      width: Math.round(scale * (aspectRatio as number)),
    };

    try {
      const response = await axios({
        baseURL: url,
        url: "/api/image/upload",
        method: "POST",
        headers: {
          "content-type": "multipart/form-data",
        },
        data,
      });

      if (response.status !== 200) {
        throw new Error("Error uploading image");
      }

      setBlockMatrix(response.data.data);
    } catch (e) {
      console.error("An error occurred: ", e);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {!loading ? (
        <>
          {selectedFile ? (
            <div className="bg-sky-200 p-2 rounded-lg shadow-md">
              <img
                src={downsampledImageString}
                alt="Selected file"
                className="w-full"
                style={{
                  imageRendering: "pixelated",
                }}
              />
            </div>
          ) : (
            <button
              className={classNames(
                "flex flex-col text-center select-none border-4 border-dashed rounded-lg m-12 p-8 gap-1",
                fileDragging ? "border-sky-400" : "border-slate-300"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleSelectFile}
            >
              <IconPhotoUp
                className={classNames(
                  "h-24 w-auto stroke-[1.25px]",
                  fileDragging ? "text-sky-400" : "text-slate-300"
                )}
              />
              <span
                className={classNames(
                  "text-lg font-semibold",
                  fileDragging && "text-sky-400"
                )}
              >
                Select an image file to upload
              </span>
              <span className="text-slate-400">or drag and drop it here</span>
            </button>
          )}
          <input
            type="file"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleFileInputChange(event)
            }
            className="hidden"
            ref={fileInputRef}
          />
          {selectedFile && (
            <div className="text-center flex flex-col">
              <span className="text-sky-500 text-lg rounded-lg bg-sky-200 w-fit px-2 self-center gap-2 flex items-center">
                <IconPhoto />
                <span>{selectedFile.name}</span>
                <button onClick={() => handleReset()}>
                  <IconTrash className="text-sky-700 hover:text-red-500" />
                </button>
              </span>
            </div>
          )}
          {aspectRatio && (
            <div className="flex flex-col">
              <span>
                Currently, the maximum height of the rendered image is 128
                pixels (blocks).
              </span>
              <Slider
                max={MAX_HEIGHT}
                min={1}
                defaultValue={scale}
                onChange={(num) => setScale(num as number)}
              />
              <span>Height: {scale} px</span>
              <span>Width: {Math.round(scale * aspectRatio)} px</span>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-64 bg-sky-200 text-xl rounded-lg flex items-center justify-center">
          <span>Loading...</span>
        </div>
      )}
      {downsampledImageString && (
        <button
          onClick={() => generateBlocks()}
          className="bg-green-200 py-2 hover:bg-green-300 text-green-800 font-semibold text-3xl rounded-lg"
        >
          Generate Minecraft block art!
        </button>
      )}
    </div>
  );
};

export default Upload;
