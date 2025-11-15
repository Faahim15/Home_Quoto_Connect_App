import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useMyQuotes = (quotes) => {
  const [myQuotes, setMyQuotes] = useState([]);
  const [userId, setUserId] = useState(null);
  console.log("show", quotes);
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId && quotes) {
      const filtered = quotes.filter((q) => q.provider._id === userId);
      setMyQuotes(filtered);
    }
  }, [userId, quotes]);

  return myQuotes;
};
