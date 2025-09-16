import axios from "axios";
import { development } from "@trustless-work/escrow";

export const http = axios.create({
  baseURL: development,
});
