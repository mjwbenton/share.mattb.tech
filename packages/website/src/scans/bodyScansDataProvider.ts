import { DataProvider, usePageData } from "@mattb.tech/data-fetching";
import BODY_SCANS_DATA from "../../data/bodyScans.json";
import { BodyScansData } from "./types";

const bodyScansDataProvider: DataProvider<never, BodyScansData> = async () => {
  return BODY_SCANS_DATA as BodyScansData;
};

export default bodyScansDataProvider;

export function useBodyScans(): BodyScansData {
  return usePageData() as BodyScansData;
}
