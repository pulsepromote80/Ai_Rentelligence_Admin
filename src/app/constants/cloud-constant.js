import Image from "next/image";
import { toast } from "react-toastify";

export const API_ENDPOINTS = {
  CLOUD: "/Category/getCloudImages",
  ADD_CLOUD: "/Category/addCloudImages",
};

// Table columns
export const Columns = [
  { key: "imageName", label: "Image Name" },
  {
    key: "imageURL", // lowercase, match your API
    label: "Image",
    render: (value) => (
      <div className="overflow-hidden rounded-md w-32 h-32">
        <Image
          src={value}
          alt="Cloud"
          width={128}
          height={128}
          className="object-cover"
        />
      </div>
    ),
  },
  
  {
    key: "copyURL",
    label: "Copy URL",
    render: (value, row) => (
      <button
        onClick={() => {
          navigator.clipboard.writeText(row.imageURL); // Copy the URL
          toast.success("URL copied to clipboard!");
        }}
        className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Copy URL
      </button>
    ),
  },{ key: "status", label: "Status" },
];
