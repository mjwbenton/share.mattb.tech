import Tile from "component/Tile";
import { SegmentalMeasurement } from "./types";
import BodyDiagram from "./BodyDiagram";
import { statusBackgrounds } from "./colours";

interface SegmentalAnalysisProps {
  segmentalLean: SegmentalMeasurement;
  segmentalFat: SegmentalMeasurement;
}

export default function SegmentalAnalysis({
  segmentalLean,
  segmentalFat,
}: SegmentalAnalysisProps) {
  return (
    <Tile>
      <div className="py-4">
        <div className="text-sm mb-4">Segmental Analysis</div>

        <div className="flex justify-between text-xs text-dark-3 dark:text-light-3 mb-2">
          <span>
            <span
              className="inline-block w-3 h-3 mr-1"
              style={{ backgroundColor: statusBackgrounds.warning.heavy }}
            />
            Under (&lt;90%)
          </span>
          <span>
            <span
              className="inline-block w-3 h-3 mr-1"
              style={{ backgroundColor: statusBackgrounds.good.heavy }}
            />
            Normal (90-110%)
          </span>
          <span>
            <span
              className="inline-block w-3 h-3 mr-1"
              style={{ backgroundColor: statusBackgrounds.bad.heavy }}
            />
            Over (&gt;110%)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-center mb-2 font-bold">
              Lean Mass Analysis
            </div>
            <BodyDiagram data={segmentalLean} type="lean" />
            <div className="text-xs text-dark-3 dark:text-light-3 text-center mt-2">
              Values in kg, % of ideal
            </div>
          </div>

          <div>
            <div className="text-sm text-center mb-2 font-bold">
              Fat Mass Analysis
            </div>
            <BodyDiagram data={segmentalFat} type="fat" />
            <div className="text-xs text-dark-3 dark:text-light-3 text-center mt-2">
              Values in kg, % of ideal
            </div>
          </div>
        </div>
      </div>
    </Tile>
  );
}
