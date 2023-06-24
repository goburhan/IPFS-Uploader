import { useState, useEffect } from "react";

export function useAddressSlice(str) {
  const [formattedString, setFormattedString] = useState("");

  useEffect(() => {
    if (str.length > 8) {
      setFormattedString(`${str.slice(0, 4)}...${str.slice(-4)}`);
    } else {
      setFormattedString(str);
    }
  }, [str]);

  return formattedString;
}
