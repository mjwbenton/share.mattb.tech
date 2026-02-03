import { useState } from "react";
import EmbeddedWrapper from "component/EmbeddedWrapper";
import { Wall } from "component/Tile";
import Expander from "component/Expander";
import { useBodyScans } from "./bodyScansDataProvider";
import InBodyScoreCard from "./InBodyScoreCard";
import WeightControlCard from "./WeightControlCard";
import BodyCompositionChart from "./BodyCompositionChart";
import MuscleFatAnalysis from "./MuscleFatAnalysis";
import ObesityAnalysis from "./ObesityAnalysis";
import BodyBalanceCard from "./BodyBalanceCard";
import VisceralFatGauge from "./VisceralFatGauge";
import SegmentalAnalysis from "./SegmentalAnalysis";
import ScanSelector from "./ScanSelector";
import CompositionHistory from "./CompositionHistory";
import ImpedanceTable from "./ImpedanceTable";

export default function BodyScans() {
  const { scans, referenceRanges } = useBodyScans();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!scans || scans.length === 0) {
    return null;
  }

  const scan = scans[selectedIndex];
  const hasMultipleScans = scans.length > 1;

  return (
    <EmbeddedWrapper>
      <div className="space-y-8">
        {hasMultipleScans && (
          <ScanSelector
            scans={scans}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        )}

        <Wall>
          <InBodyScoreCard score={scan.inBodyScore} />
          <WeightControlCard weightControl={scan.weightControl} />
        </Wall>

        <BodyCompositionChart
          composition={scan.bodyComposition}
          referenceRanges={referenceRanges}
        />

        <Wall>
          <MuscleFatAnalysis
            smm={scan.bodyComposition.skeletalMuscleMass}
            bodyFatMass={scan.bodyComposition.bodyFatMass}
            weight={scan.bodyComposition.weight}
            referenceRanges={referenceRanges}
          />
          <ObesityAnalysis obesityAnalysis={scan.obesityAnalysis} />
        </Wall>

        <Wall>
          <BodyBalanceCard bodyBalance={scan.bodyBalance} />
          <VisceralFatGauge level={scan.visceralFatLevel} />
        </Wall>

        <SegmentalAnalysis
          segmentalLean={scan.segmentalLean}
          segmentalFat={scan.segmentalFat}
        />

        {hasMultipleScans && <CompositionHistory scans={scans} />}

        <Expander text="Technical Details">
          <ImpedanceTable impedance={scan.impedance} />
        </Expander>

        {scan.sourceImage && (
          <Expander text="Source Image">
            <img
              src={`/images/${scan.sourceImage}`}
              alt={`InBody scan from ${scan.date}`}
              className="max-w-full h-auto"
            />
          </Expander>
        )}
      </div>
    </EmbeddedWrapper>
  );
}
