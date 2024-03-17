// src/services/dataService.ts
import axios from "axios";
import { config } from "../config";

export const fetchData = async () => {
  try {
    const response = await axios.get(
      `${config.dataAcquisitionServiceURL}/api/data`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
