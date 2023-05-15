import React from "react";
import { useParams } from "react-router-dom";

export default function DisplayFiles() {
  const IPFS_Link = "https://ipfs.moralis.io:2053/ipfs/";
  const { id } = useParams();
  const path = IPFS_Link + id.replace("+", "/");

  return (
    <div>
      <img
        src={path}
        alt=""
        style={{
          height: "auto",
          width: "auto",
          maxWidth: "700px",
          maxHeight: "620px",
        }}
      ></img>
    </div>
  );
}
